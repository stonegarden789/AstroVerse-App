import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations, TAROT_DECK } from '../constants';
import { generateTarotReading, generateCelticCrossReading } from '../services/geminiService';
import { LoadingScreen } from './LoadingScreen';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';
import { MarkdownRenderer } from './MarkdownRenderer';

type TarotView = 'menu' | 'daily' | 'threeCard' | 'celticCross';
type Card = typeof TAROT_DECK.en[0];

const MenuButton: React.FC<{ title: string; subtitle: string; onClick: () => void; }> = ({ title, subtitle, onClick }) => (
    <button onClick={onClick} className="card-base p-6 rounded-2xl w-full text-left transition-all duration-300 hover:border-violet-400/50 hover:-translate-y-1 group">
        <h3 className="text-xl font-bold text-gray-100 group-hover:celestial-title transition-colors">{title}</h3>
        <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
    </button>
);

const TarotCardDisplay: React.FC<{ card: Card | null, position?: string, isFlipped: boolean }> = ({ card, position, isFlipped }) => (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
        {position && <p className="text-[10px] font-bold text-violet-300 text-center uppercase tracking-[0.2em] mb-1">{position}</p>}
        
        <div className="w-40 h-64 sm:w-44 sm:h-72 rounded-lg shadow-2xl perspective-1000 group">
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Back of Card - Cosmic Pattern */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#1a1b3c] rounded-lg border-4 border-white shadow-inner overflow-hidden">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    <div className="w-full h-full border border-white/20 m-1.5 rounded flex items-center justify-center">
                         <div className="w-12 h-12 rounded-full border border-violet-400/50 flex items-center justify-center">
                            <span className="text-xl text-violet-200">✦</span>
                         </div>
                    </div>
                </div>

                {/* Front of Card - Rider Waite Sticker Style */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg overflow-hidden shadow-lg border-4 border-white">
                   {card && card.imageUrl ? (
                    <div className="flex flex-col h-full bg-white">
                         {/* Image Area - Sticker Look */}
                        <div className="flex-grow relative overflow-hidden m-1 rounded-sm border border-gray-100">
                             <img 
                                src={card.imageUrl} 
                                alt={card.name} 
                                className="w-full h-full object-cover object-center scale-105" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x250?text=Tarot+Card';
                                }}
                             />
                        </div>
                        
                        {/* Label Area */}
                        <div className="h-10 flex flex-col items-center justify-center bg-white text-black">
                            <p className="text-[10px] font-bold font-serif uppercase tracking-tight leading-none mb-0.5">{card.name}</p>
                            {card.arcana && <p className="text-[8px] text-gray-400 uppercase tracking-widest">{card.arcana}</p>}
                        </div>
                    </div>
                   ) : card ? (
                       <div className="w-full h-full flex flex-col justify-center items-center text-center p-4 bg-white text-black">
                            <p className="text-lg font-bold font-serif">{card.name}</p>
                            <p className="text-xs text-gray-500 mt-2">{card.arcana}</p>
                       </div>
                   ) : null }
                </div>
            </div>
        </div>
    </div>
);

// Helper to validate if a string is likely a coherent question rather than gibberish
const isLogicalQuestion = (q: string): boolean => {
    const text = q.trim();
    if (text.length < 10) return false;
    
    // Check for repetitive characters (e.g., "aaaaaaaa")
    if (/(.)\1{4,}/.test(text)) return false;

    // Check for extreme lack of vowels in long strings (common in gibberish)
    const vowels = text.match(/[aeiouy]/gi);
    if (text.length > 20 && (!vowels || vowels.length < (text.length / 5))) return false;

    // Basic logic: must contain spaces if it's a "logical" sentence of some length
    if (!text.includes(' ') && text.length > 25) return false;

    return true;
};

export const TarotOracle: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].tarotOracle;
    const deck = useMemo(() => TAROT_DECK[language] || TAROT_DECK.en, [language]);
    
    const [view, setView] = useState<TarotView>('menu');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [question, setQuestion] = useState('');
    const [drawnCards, setDrawnCards] = useState<Card[]>([]);
    const [reading, setReading] = useState<string>('');
    const [areCardsFlipped, setAreCardsFlipped] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const drawAndSetCards = (count: number) => {
        const shuffled = [...deck].sort(() => 0.5 - Math.random());
        const newCards = shuffled.slice(0, count);
        setDrawnCards(newCards);
        setAreCardsFlipped(false);
        setTimeout(() => setAreCardsFlipped(true), 300);
        return newCards;
    };

    const generateReadingForCards = useCallback(async (cardsToRead: Card[]) => {
        setValidationError(null);
        if (!isLogicalQuestion(question)) {
            setValidationError(language === 'ro' 
                ? "Te rog să introduci o întrebare clară și logică pentru a primi o citire de tarot." 
                : "Please enter a clear and logical question to receive a tarot reading.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setReading('');
        try {
            let result = '';
            if (view === 'threeCard' && cardsToRead.length === 3) {
                result = await generateTarotReading(
                    question,
                    [
                        { name: cardsToRead[0].name, position: t.positions.past },
                        { name: cardsToRead[1].name, position: t.positions.present },
                        { name: cardsToRead[2].name, position: t.positions.future },
                    ],
                    language
                );
            } else if (view === 'celticCross' && cardsToRead.length === 10) {
                 result = await generateCelticCrossReading(
                    question,
                    [
                        { name: cardsToRead[0].name, position: t.positions.situation },
                        { name: cardsToRead[1].name, position: t.positions.challenge },
                        { name: cardsToRead[2].name, position: t.positions.past_foundation },
                        { name: cardsToRead[3].name, position: t.positions.recent_past },
                        { name: cardsToRead[4].name, position: t.positions.potential },
                        { name: cardsToRead[5].name, position: t.positions.near_future },
                        { name: cardsToRead[6].name, position: t.positions.self_perception },
                        { name: cardsToRead[7].name, position: t.positions.external_influence },
                        { name: cardsToRead[8].name, position: t.positions.hopes_fears },
                        { name: cardsToRead[9].name, position: t.positions.outcome },
                    ],
                    language
                );
            }
            setReading(result);
        } catch (err: any) {
            setError(translations[language].error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [question, view, language, t.positions]);
    
    const handleDrawDaily = () => {
        const cards = drawAndSetCards(1);
        const card = cards[0];
        setReading(`### 🔮 ${card.name}\n\n**${card.keywords}**\n\n${card.meaning.short}`);
    };
    
    const handleGetThreeCardReading = async () => {
        if (!question.trim()) return;
        const cards = drawAndSetCards(3);
        await generateReadingForCards(cards);
    };
    
    const handleGetCelticCrossReading = async () => {
        if (!question.trim()) return;
        const cards = drawAndSetCards(10);
        await generateReadingForCards(cards);
    };

    const reset = (newView: TarotView = 'menu') => {
        setView(newView);
        setQuestion('');
        setDrawnCards([]);
        setReading('');
        setAreCardsFlipped(false);
        setError(null);
        setValidationError(null);
        setIsLoading(false);
    }
    
    const renderMenu = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                <p className="text-gray-400 mt-2">{t.menuTitle}</p>
            </div>
            <div className="space-y-4 max-w-lg mx-auto">
                <MenuButton title={t.dailyTitle} subtitle={t.dailySubtitle} onClick={() => { setView('daily'); handleDrawDaily(); }} />
                <MenuButton title={t.threeCardTitle} subtitle={t.threeCardSubtitle} onClick={() => setView('threeCard')} />
                <MenuButton title={t.celticCrossTitle} subtitle={t.celticCrossSubtitle} onClick={() => setView('celticCross')} />
            </div>
        </div>
    );
    
    const renderReadingInterface = (
        title: string,
        subtitle: string,
        showQuestionInput: boolean,
        onGenerate: () => void,
        cardPositions: string[]
    ) => {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                     <h2 className="text-2xl sm:text-3xl font-bold celestial-title">{title}</h2>
                     {(!drawnCards.length && !showQuestionInput) && <p className="text-gray-400 mt-2">{subtitle}</p>}
                </div>
                
                {!drawnCards.length && showQuestionInput ? (
                    <div className="max-w-xl mx-auto space-y-4">
                         <textarea
                            rows={2} value={question} onChange={(e) => {setQuestion(e.target.value); setValidationError(null);}}
                            placeholder={t.askQuestionPlaceholder}
                            className={`w-full bg-gray-900/50 border ${validationError ? 'border-red-500' : 'border-violet-800/50'} text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 outline-none transition-all`}
                        />
                        {validationError && <p className="text-red-400 text-xs mt-1 animate-pulse">{validationError}</p>}
                        <button onClick={onGenerate} disabled={!question.trim() || isLoading} className="w-full button-primary">{t.getReadingButton}</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-8 flex justify-center">
                         <div className="flex flex-wrap justify-center items-start gap-4 sm:gap-6 mx-auto px-4 max-w-6xl">
                            {drawnCards.map((card, index) => (
                                 <TarotCardDisplay 
                                    key={index} 
                                    card={card} 
                                    position={cardPositions[index]} 
                                    isFlipped={areCardsFlipped}
                                 />
                            ))}
                        </div>
                    </div>
                )}
    
                {isLoading && <div className="flex justify-center"><LoadingScreen /></div>}
                {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center my-4">{error}</div>}
                
                {reading && !isLoading && (
                     <div className="card-base p-6 rounded-2xl animate-fade-in space-y-4 max-w-4xl mx-auto">
                        {question && <p className="text-sm text-center text-gray-400">{t.readingFor} <strong className="text-gray-200">"{question}"</strong></p>}
                        <div className="text-gray-300 leading-relaxed p-4 bg-black/20 rounded-lg max-h-[600px] overflow-y-auto">
                            <MarkdownRenderer content={reading} className="markdown-content" />
                        </div>
                         <div className="flex flex-col sm:flex-row pt-4 gap-4">
                            <AudioPlayer textToSpeak={reading} />
                            <ShareButton shareText={reading} shareTitle={title} />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch(view) {
            case 'daily':
                return renderReadingInterface(t.dailyTitle, t.dailySubtitle, false, () => {}, [""]);
            case 'threeCard':
                return renderReadingInterface(t.threeCardTitle, t.threeCardSubtitle, true, handleGetThreeCardReading, [t.positions.past, t.positions.present, t.positions.future]);
            case 'celticCross':
                 return renderReadingInterface(t.celticCrossTitle, t.celticCrossSubtitle, true, handleGetCelticCrossReading, [
                    t.positions.situation, t.positions.challenge, t.positions.past_foundation, t.positions.recent_past, t.positions.potential,
                    t.positions.near_future, t.positions.self_perception, t.positions.external_influence, t.positions.hopes_fears, t.positions.outcome
                ]);
            case 'menu':
            default:
                return renderMenu();
        }
    };
    
    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl min-h-[70vh] relative">
            {view !== 'menu' && (
                <button onClick={() => reset()} className="absolute top-4 left-4 bg-white/10 p-2 rounded-full text-sm hover:bg-white/20 transition-colors z-10 flex items-center gap-1.5 px-3">
                   <span className="transform scale-x-[-1]">&rarr;</span> {t.backToMenu}
                </button>
            )}
            {renderContent()}
        </div>
    );
};