import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { startAITeacherChat } from '../services/geminiService';
import { Spinner } from './Spinner';
import type { Chat } from '@google/genai';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
    sender: 'user' | 'teacher';
    text: string;
}

export const AITeacherModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { language } = useLanguage();
    const t = translations[language].astroAcademy.aiTeacher;
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(startAITeacherChat(language));
    }, [language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chat || isLoading) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            let teacherResponse = '';
            setMessages(prev => [...prev, { sender: 'teacher', text: '' }]);

            for await (const chunk of responseStream) {
                teacherResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'teacher', text: teacherResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to AI Teacher:", error);
            setMessages(prev => [...prev, { sender: 'teacher', text: translations[language].error.reading }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={onClose}>
            <div className="card-base w-full max-w-2xl h-[80vh] rounded-2xl p-4 sm:p-6 space-y-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
                 <div className="text-center border-b border-white/10 pb-4 flex-shrink-0">
                    <h2 className="text-2xl sm:text-3xl font-bold celestial-title">{t.title}</h2>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">{t.subtitle}</p>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-violet-800 text-white' : 'bg-gray-700 text-gray-200'}`}>
                               <MarkdownRenderer content={msg.text} className="text-sm leading-relaxed chat-markdown" />
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

                <div className="flex items-center gap-2 pt-4 border-t border-white/10 flex-shrink-0">
                    <input
                        type="text" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t.placeholder}
                        className="flex-grow bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="button-primary px-4 py-2.5">
                       {t.button}
                    </button>
                </div>
            </div>
        </div>
    )
}