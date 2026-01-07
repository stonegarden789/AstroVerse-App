import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations, COGNITIVE_PROFILER_QUIZ } from '../constants';
import { generateCognitiveProfile } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { CognitiveProfile } from '../types';

interface CognitiveProfilerProps {
    onProfileComplete: (profile: CognitiveProfile) => void;
}

type QuizStep = 'start' | 'questions' | 'result';
type Answers = { [key: number]: number };

export const CognitiveProfiler: React.FC<CognitiveProfilerProps> = ({ onProfileComplete }) => {
    const { language } = useLanguage();
    const t = translations[language].cognitiveProfiler;
    const quizTranslations = COGNITIVE_PROFILER_QUIZ.translations[language];

    const [step, setStep] = useState<QuizStep>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [report, setReport] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<CognitiveProfile | null>(null);

    const questions = useMemo(() => COGNITIVE_PROFILER_QUIZ.questions, []);
    
    const generateReport = useCallback(async (cognitiveProfile: CognitiveProfile) => {
        setIsLoading(true);
        setReport(null);
        try {
            const generatedReport = await generateCognitiveProfile(cognitiveProfile, language);
            setReport(generatedReport);
        } catch (error) {
            console.error("Failed to generate cognitive profile:", error);
            setReport(translations[language].error.reading);
        } finally {
            setIsLoading(false);
        }
    }, [language]);


    const calculateResult = useCallback((finalAnswers: Answers) => {
        setStep('result');

        const scores = {
            ocean: { O: 0, C: 0, E: 0, A: 0, N: 0 },
            mbti: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
            enneagram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
        };

        questions.forEach(q => {
            const answerIndex = finalAnswers[q.id];
            if (answerIndex !== undefined) {
                const answerScores = q.answers[answerIndex].scores;
                if('ocean' in answerScores && answerScores.ocean) Object.keys(answerScores.ocean).forEach(k => scores.ocean[k as keyof typeof scores.ocean] += (answerScores.ocean as any)[k]);
                if('mbti' in answerScores && answerScores.mbti) Object.keys(answerScores.mbti).forEach(k => scores.mbti[k as keyof typeof scores.mbti] += (answerScores.mbti as any)[k]);
                if('enneagram' in answerScores && answerScores.enneagram) Object.keys(answerScores.enneagram).forEach(k => scores.enneagram[k as keyof typeof scores.enneagram] += (answerScores.enneagram as any)[k]);
            }
        });
        
        const getOceanLevel = (score: number): 'High' | 'Medium' | 'Low' => {
            if (score >= 2) return 'High';
            if (score <= -2) return 'Low';
            return 'Medium';
        };

        const finalProfile: CognitiveProfile = {
            ocean: {
                O: getOceanLevel(scores.ocean.O),
                C: getOceanLevel(scores.ocean.C),
                E: getOceanLevel(scores.ocean.E),
                A: getOceanLevel(scores.ocean.A),
                N: getOceanLevel(scores.ocean.N),
            },
            mbti: [
                scores.mbti.E >= scores.mbti.I ? 'E' : 'I',
                scores.mbti.N >= scores.mbti.S ? 'N' : 'S',
                scores.mbti.T >= scores.mbti.F ? 'T' : 'F',
                scores.mbti.J >= scores.mbti.P ? 'J' : 'P',
            ].join(''),
            enneagram: `Type ${Object.keys(scores.enneagram).reduce((a, b) => scores.enneagram[a as keyof typeof scores.enneagram] > scores.enneagram[b as keyof typeof scores.enneagram] ? a : b)}`
        };
        
        setProfile(finalProfile);
        onProfileComplete(finalProfile);
        generateReport(finalProfile);
    }, [questions, onProfileComplete, generateReport]);

    const handleAnswer = (questionId: number, answerIndex: number) => {
        const newAnswers = { ...answers, [questionId]: answerIndex };
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResult(newAnswers);
        }
    };
    
    useEffect(() => {
        if (report && profile) {
            generateReport(profile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);


    const handleRetake = () => {
        setStep('start');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setReport(null);
        setProfile(null);
    }

    const renderContent = () => {
        if (step === 'start') {
            return (
                <div className="text-center animate-fade-in">
                    <h2 className="text-3xl font-bold celestial-title">{t.startTitle}</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{t.startDescription}</p>
                    <button onClick={() => setStep('questions')} className="button-primary mt-8">
                        {t.startButton}
                    </button>
                </div>
            );
        }

        if (step === 'questions') {
            const question = questions[currentQuestionIndex];
            const questionText = quizTranslations[question.questionKey as keyof typeof quizTranslations];
            
            return (
                <div className="animate-fade-in w-full max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <p className="text-violet-300 font-semibold">{t.question} {currentQuestionIndex + 1} {t.of} {questions.length}</p>
                        <h3 className="text-2xl font-semibold text-white mt-2">{questionText}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.answers.map((answer, index) => {
                             const answerText = quizTranslations[answer.textKey as keyof typeof quizTranslations];
                             return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(question.id, index)}
                                    className="card-base p-4 rounded-lg text-left text-gray-300 hover:bg-violet-800/60 hover:border-violet-400/50 transition-all duration-200"
                                >
                                    {answerText}
                                </button>
                             )
                        })}
                    </div>
                </div>
            );
        }

        if (step === 'result') {
            if (isLoading) {
                return <LoadingScreen />;
            }

            return (
                <div className="animate-fade-in space-y-8 w-full">
                     <div className="text-center">
                        <h2 className="text-3xl font-bold celestial-title">{t.resultsTitle}</h2>
                        <p className="text-gray-400 mt-2">{t.resultsDescription}</p>
                    </div>
                    {report && (
                         <div className="space-y-6">
                            <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg">
                                <MarkdownRenderer content={report} className="markdown-content" />
                            </div>
                            <div className="flex flex-col sm:flex-row pt-4 gap-4">
                                <AudioPlayer textToSpeak={report} />
                                <ShareButton shareText={report} shareTitle={t.resultsTitle} />
                            </div>
                         </div>
                    )}
                     <div className="text-center pt-4">
                        <button onClick={handleRetake} className="button-primary bg-gray-600 hover:bg-gray-700 shadow-gray-500/40 hover:shadow-gray-500/60">
                            {t.retakeButton}
                        </button>
                     </div>
                </div>
            )
        }
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl flex items-center justify-center min-h-[50vh]">
            {renderContent()}
        </div>
    );
};
