import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations, INTEGRAL_NEURO_EMOTIVE_PROFILE_QUIZ } from '../constants';
import { generateIntegralProfileAnalysis } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RadarChart } from './RadarChart';
import { Spinner } from './Spinner';

type QuizStep = 'start' | 'quiz' | 'results';
type Question = typeof INTEGRAL_NEURO_EMOTIVE_PROFILE_QUIZ.questions[0];

const ScoreCard: React.FC<{ title: string, score: number }> = ({ title, score }) => (
    <div className="card-base p-4 rounded-xl text-center">
        <p className="text-sm text-violet-300">{title}</p>
        <p className="text-3xl font-bold text-white">{score}</p>
    </div>
);

export const IntegralNeuroEmotiveProfile: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].integralNeuroEmotiveProfile;
    const quizTranslations = INTEGRAL_NEURO_EMOTIVE_PROFILE_QUIZ.translations[language];

    const [step, setStep] = useState<QuizStep>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [scores, setScores] = useState<{ sir: number; siv: number; sea: number; sev: number; } | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const timeTracker = useRef<{ startTime: number, endTime: number }>({ startTime: 0, endTime: 0 });

    const questions = useMemo<Question[]>(() => {
        setAnswers(new Array(INTEGRAL_NEURO_EMOTIVE_PROFILE_QUIZ.questions.length).fill(null));
        return INTEGRAL_NEURO_EMOTIVE_PROFILE_QUIZ.questions;
    }, []);
    
    const generateAnalysis = useCallback(async (currentScores: { sir: number; siv: number; sea: number; sev: number; }) => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await generateIntegralProfileAnalysis(currentScores, language, translations[language]);
            setAnalysis(result);
        } catch (error) {
            console.error(error);
            setAnalysis(translations[language].error.reading);
        }
        setIsLoading(false);
    }, [language]);

    const calculateAndFetchResults = useCallback((finalAnswers: (number | null)[]) => {
        setStep('results');

        const logicAnswers = finalAnswers.slice(0, 5);
        const logicQuestions = questions.slice(0, 5);
        let logicCorrect = 0;
        logicAnswers.forEach((answer, index) => {
            if (answer !== null && `opt_${String.fromCharCode(96 + answer)}` === logicQuestions[index].correctOption) {
                logicCorrect++;
            }
        });
        const sir = (logicCorrect / 5) * 100;

        const totalTime = (timeTracker.current.endTime - timeTracker.current.startTime) / 1000;
        const avgTime = totalTime / 5;
        const siv = Math.max(0, Math.round(100 - (avgTime * 4)));

        const adaptationAnswers = finalAnswers.slice(10, 15).filter(a => a !== null) as number[];
        const sea = Math.round((adaptationAnswers.reduce((sum, a) => sum + a, 0) / (adaptationAnswers.length * 5)) * 100);

        const vulnerabilityAnswers = finalAnswers.slice(15, 20);
        const vulnerabilityQuestions = questions.slice(15, 20);
        let sevTotal = 0;
        vulnerabilityAnswers.forEach((answer, index) => {
            if(answer !== null) {
                sevTotal += vulnerabilityQuestions[index].isInverted ? (6 - answer) : answer;
            }
        });
        const sev = Math.round((sevTotal / (vulnerabilityAnswers.filter(a => a !== null).length * 5)) * 100);

        const calculatedScores = { sir, siv, sea, sev };
        setScores(calculatedScores);
        generateAnalysis(calculatedScores);
    }, [questions, generateAnalysis]);
    
    useEffect(() => {
        if (analysis && scores) {
            generateAnalysis(scores);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    const handleAnswer = (answer: number | string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = typeof answer === 'string' ? parseInt(answer.split('_')[1], 10) : answer;
        setAnswers(newAnswers);

        if (currentQuestionIndex === 5) {
            timeTracker.current.startTime = performance.now();
        }
        if (currentQuestionIndex === 9) {
            timeTracker.current.endTime = performance.now();
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateAndFetchResults(newAnswers);
        }
    };


    const handleRetake = () => {
        setStep('start');
        setCurrentQuestionIndex(0);
        setAnswers(new Array(questions.length).fill(null));
        setScores(null);
        setAnalysis(null);
        timeTracker.current = { startTime: 0, endTime: 0 };
    };
    
    const renderStart = () => (
        <div className="text-center animate-fade-in space-y-6">
            <h2 className="text-3xl font-bold celestial-title">{t.startTitle}</h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{t.startDescription}</p>
            <div className="pt-4">
                 <button onClick={() => setStep('quiz')} className="button-primary">{t.startButton}</button>
            </div>
        </div>
    );
    
    const renderQuiz = () => {
        const q = questions[currentQuestionIndex];
        const questionText = quizTranslations[q.questionKey as keyof typeof quizTranslations] as string;
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

        return (
             <div className="animate-fade-in w-full max-w-3xl mx-auto">
                <div className="mb-8">
                     <div className="flex justify-between items-center mb-2 text-sm text-violet-300 font-semibold">
                        <p>{q.category.charAt(0).toUpperCase() + q.category.slice(1)} IQ/EQ</p>
                        <p>{t.question} {currentQuestionIndex + 1} {t.of} {questions.length}</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-violet-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div>
                </div>

                <div className="text-center min-h-[6rem] flex items-center justify-center">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">{questionText}</h3>
                </div>

                {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {Object.entries(quizTranslations[q.optionsKey as keyof typeof quizTranslations] as Record<string, string>).map(([key, text]) => (
                             <button
                                key={key}
                                onClick={() => handleAnswer(parseInt(key.split('_')[1], 10))}
                                className="card-base p-4 rounded-lg text-center text-lg text-gray-300 hover:bg-violet-800/60 hover:border-violet-400/50 transition-all duration-200"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                )}

                {q.type === 'likert' && (
                    <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
                        {t.likert.map((label, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <button onClick={() => handleAnswer(index + 1)} className="w-12 h-12 rounded-full border-2 border-violet-700/50 flex items-center justify-center text-white font-bold text-lg hover:bg-violet-600 transition-colors">
                                    {index + 1}
                                </button>
                                <label className="text-xs text-center text-gray-400 w-20">{label}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderResults = () => {
        if (!scores) return null;
        return (
            <div className="animate-fade-in space-y-8 w-full">
                <div className="text-center">
                    <h2 className="text-3xl font-bold celestial-title">{t.resultsTitle}</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <ScoreCard title={t.sirScore} score={scores.sir} />
                    <ScoreCard title={t.sivScore} score={scores.siv} />
                    <ScoreCard title={t.seaScore} score={scores.sea} />
                    <ScoreCard title={t.sevScore} score={scores.sev} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="h-64 md:h-80 flex items-center justify-center">
                       <RadarChart data={[
                           { axis: "SIR", value: scores.sir },
                           { axis: "SIV", value: scores.siv },
                           { axis: "SEA", value: scores.sea },
                           { axis: "SEV", value: scores.sev },
                       ]} />
                    </div>

                    <div className="card-base p-6 rounded-2xl min-h-[20rem]">
                        <h3 className="text-2xl font-bold celestial-title text-center mb-4">{t.analysis.title}</h3>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                 <Spinner />
                                 <p className="mt-2 text-violet-300">{t.analysis.generating}</p>
                            </div>
                        ) : (
                            <div className="text-gray-300 leading-relaxed overflow-y-auto max-h-80 pr-2">
                                <MarkdownRenderer content={analysis || ''} className="markdown-content" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center pt-4">
                    <button onClick={handleRetake} className="button-primary bg-gray-600 hover:bg-gray-700 shadow-gray-500/40 hover:shadow-gray-500/60">
                        {t.retakeButton}
                    </button>
                </div>
            </div>
        )
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl flex items-center justify-center min-h-[70vh]">
            {step === 'start' && renderStart()}
            {step === 'quiz' && renderQuiz()}
            {step === 'results' && renderResults()}
        </div>
    );
};
