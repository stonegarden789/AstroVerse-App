import React, { useState, useEffect, useRef } from 'react';
import type { BirthData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { startAstroChat } from '../services/geminiService';
import { Spinner } from './Spinner';
import type { Chat } from '@google/genai';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useTTS } from '../contexts/TTSContext';

interface AskTheOracleProps {
    birthData: BirthData;
}

interface Message {
    sender: 'user' | 'oracle';
    text: string;
}

const MicIcon: React.FC<{ active: boolean }> = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'text-red-500 animate-pulse' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export const AskTheOracle: React.FC<AskTheOracleProps> = ({ birthData }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Voice & Hands Free State
    const [isHandsFreeMode, setIsHandsFreeMode] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const recognitionRef = useRef<any>(null);
    const tts = useTTS();
    const [voiceError, setVoiceError] = useState<string | null>(null);

    // Keep a ref to the latest hands free state to use inside callbacks/timeouts
    const isHandsFreeRef = useRef(isHandsFreeMode);
    useEffect(() => {
        isHandsFreeRef.current = isHandsFreeMode;
    }, [isHandsFreeMode]);

    useEffect(() => {
        const chatInstance = startAstroChat(birthData, language);
        setChat(chatInstance);
    }, [birthData, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Hands Free Conversation Loop ---
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        // Only attempt to start listening if:
        // 1. Hands Free Mode is ON (checked via ref for safety in timeouts)
        // 2. AI is NOT currently speaking (TTS is not playing)
        // 3. AI is NOT currently thinking (isLoading is false)
        // 4. Mic is NOT already active
        if (isHandsFreeMode && !tts.isPlaying && !isLoading && !isMicActive) {
            // Add a small delay to ensure AudioContext is fully released and prevent browser "not-allowed" errors
            timeout = setTimeout(() => {
                 if (isHandsFreeRef.current && !tts.isPlaying && !isLoading && !recognitionRef.current) {
                    startListening();
                 }
            }, 800);
        } else if (!isHandsFreeMode || tts.isPlaying || isLoading) {
            // If any condition fails, ensure mic is stopped.
            if (isMicActive || recognitionRef.current) {
                stopListening();
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHandsFreeMode, tts.isPlaying, isLoading, isMicActive]);


    const startListening = () => {
        // Double check ref to prevent race conditions
        if (recognitionRef.current || !isHandsFreeRef.current) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceError("Voice recognition not supported.");
            setIsHandsFreeMode(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;
            
            const langMap: Record<string, string> = {
                'en': 'en-US',
                'ro': 'ro-RO',
                'es': 'es-ES',
                'fr': 'fr-FR',
                'de': 'de-DE'
            };
            recognition.lang = langMap[language] || 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsMicActive(true);
                setVoiceError(null);
            };
            
            recognition.onend = () => {
                setIsMicActive(false);
                recognitionRef.current = null;
            };
            
            recognition.onerror = (event: any) => {
                console.error("Speech error:", event.error);
                setIsMicActive(false);
                recognitionRef.current = null;
                
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setVoiceError("Microphone access denied.");
                    setIsHandsFreeMode(false); // Strictly disable hands free
                } else if (event.error === 'no-speech') {
                    // Ignore no-speech errors in hands-free loop
                } else {
                     // For other errors, disable to be safe and show error
                     setVoiceError("Voice Error. Mode stopped.");
                     setIsHandsFreeMode(false);
                }
            };
            
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                if (transcript.trim()) {
                    setInput(transcript);
                    handleSend(transcript);
                }
            };

            recognition.start();
        } catch (err) {
            console.error("Failed to start recognition:", err);
            setIsHandsFreeMode(false);
            recognitionRef.current = null;
            setVoiceError("Failed to access microphone.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch(e) { /* ignore */ }
            recognitionRef.current = null;
        }
        setIsMicActive(false);
    };

    const toggleHandsFree = () => {
        setVoiceError(null);
        if (isHandsFreeMode) {
            setIsHandsFreeMode(false);
            stopListening();
            tts.stop(); 
        } else {
            setIsHandsFreeMode(true);
        }
    };

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || !chat || isLoading) return;
        
        stopListening();

        const userMessage: Message = { sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: textToSend });
            let oracleResponse = '';
            setMessages(prev => [...prev, { sender: 'oracle', text: '' }]);

            for await (const chunk of responseStream) {
                oracleResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'oracle', text: oracleResponse };
                    return newMessages;
                });
            }
            
            if (isHandsFreeRef.current || textOverride) {
                tts.play(oracleResponse, `oracle-${Date.now()}`);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'oracle', text: t.error.reading }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card-base p-4 sm:p-6 rounded-2xl space-y-4 h-[70vh] flex flex-col">
            <div className="text-center border-b border-white/10 pb-4">
                <h2 className="text-2xl sm:text-3xl font-bold celestial-title">{t.askTheOracle.title}</h2>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">{t.askTheOracle.subtitle}</p>
                <div className="flex flex-col items-center mt-2">
                    <button 
                        onClick={toggleHandsFree}
                        className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${isHandsFreeMode ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-violet-500'}`}
                    >
                        <MicIcon active={isMicActive} />
                        {isHandsFreeMode ? (isMicActive ? 'Listening...' : 'Hands Free Active') : 'Hands Free Mode'}
                    </button>
                    {voiceError && <p className="text-red-400 text-xs mt-2">{voiceError}</p>}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-violet-800 text-white' : 'bg-gray-700 text-gray-200'}`}>
                           {msg.sender === 'user' ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                                <MarkdownRenderer
                                    content={msg.text}
                                    className="text-sm leading-relaxed chat-markdown"
                                />
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-md p-3 rounded-lg bg-gray-700">
                           <Spinner />
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                 <button onClick={() => startListening()} disabled={isHandsFreeMode} className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50">
                    <MicIcon active={isMicActive} />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.askTheOracle.placeholder}
                    className="flex-grow bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500"
                    disabled={isLoading}
                />
                <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="button-primary px-4 py-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};