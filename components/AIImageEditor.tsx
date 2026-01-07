import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { editImageWithPrompt } from '../services/geminiService';
import { Spinner } from './Spinner';

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-violet-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const AIImageEditor: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].aiImageEditor;

    const [originalImage, setOriginalImage] = useState<{ file: File, base64: string } | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            try {
                const base64 = await fileToBase64(file);
                setOriginalImage({ file, base64 });
                setEditedImage(null);
                setError(null);
            } catch (err) {
                setError("Failed to read image file.");
            }
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };
    
    const handleGenerate = useCallback(async () => {
        if (!originalImage || !prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const resultBase64 = await editImageWithPrompt(originalImage.base64, originalImage.file.type, prompt);
            setEditedImage(`data:${originalImage.file.type};base64,${resultBase64}`);
        } catch (err) {
            setError(translations[language].error.reading);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, prompt, language]);

    const handleStartOver = () => {
        setOriginalImage(null);
        setEditedImage(null);
        setPrompt('');
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                <p className="text-gray-400 mt-2">{t.subtitle}</p>
            </div>
            
            {isLoading && (
                 <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-violet-500/30 rounded-xl bg-black/20">
                    <Spinner />
                    <p className="mt-4 text-violet-300 font-bold animate-pulse">✨ {t.generating} ✨</p>
                </div>
            )}

            {!isLoading && error && (
                <div className="text-center animate-fade-in">
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">{translations[language].error.title}</strong>
                        <p>{error}</p>
                    </div>
                    <button onClick={handleStartOver} className="button-primary mt-6">{t.startOver}</button>
                </div>
            )}
            
            {!isLoading && !originalImage && (
                 <div className="space-y-4 animate-fade-in max-w-xl mx-auto">
                     <div 
                        className="w-full h-48 border-2 border-dashed border-violet-800/50 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-violet-900/20 transition-colors group"
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                         <UploadIcon />
                         <p className="text-gray-400 mt-2">{t.uploadArea.title}</p>
                         <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} className="hidden" accept="image/*" />
                     </div>
                     <div className="flex items-center gap-4">
                         <hr className="flex-grow border-t border-violet-800/50"/>
                         <span className="text-gray-500">{t.uploadArea.or}</span>
                         <hr className="flex-grow border-t border-violet-800/50"/>
                     </div>
                     <button onClick={() => alert("Camera access not implemented yet.")} className="w-full flex items-center justify-center gap-2 text-gray-300 bg-gray-700/50 hover:bg-gray-700 p-3 rounded-lg transition-colors">
                         <CameraIcon /> {t.uploadArea.cameraButton}
                     </button>
                 </div>
            )}

            {!isLoading && originalImage && !editedImage && (
                 <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
                     <div className="relative group">
                         <img src={`data:${originalImage.file.type};base64,${originalImage.base64}`} alt="Original" className="rounded-lg max-w-full mx-auto max-h-80 shadow-lg" />
                         <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">Original</div>
                     </div>
                     <div>
                        <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">{t.promptLabel}</label>
                        <textarea
                            id="edit-prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t.promptPlaceholder}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 outline-none"
                        />
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handleGenerate} disabled={!prompt.trim()} className="w-full button-primary flex items-center justify-center gap-2">
                             {t.generateButton}
                        </button>
                        <button onClick={handleStartOver} className="w-full button-primary bg-gray-600 hover:bg-gray-700 shadow-gray-500/40">{t.startOver}</button>
                     </div>
                 </div>
            )}
            
            {!isLoading && editedImage && (
                 <div className="space-y-6 animate-fade-in text-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="relative">
                            <img src={`data:${originalImage?.file.type};base64,${originalImage?.base64}`} alt="Original" className="rounded-lg max-w-full mx-auto opacity-70 hover:opacity-100 transition-opacity" />
                             <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">Before</div>
                        </div>
                        <div className="relative">
                            <img src={editedImage} alt="Edited by AI" className="rounded-lg max-w-full mx-auto shadow-2xl shadow-violet-500/30" />
                            <div className="absolute top-2 left-2 bg-violet-600 px-2 py-1 rounded text-xs text-white">After ✨</div>
                        </div>
                    </div>
                    <button onClick={handleStartOver} className="button-primary mt-6">{t.startOver}</button>
                 </div>
            )}
        </div>
    );
};