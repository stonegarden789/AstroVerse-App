import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { AITeacherModal } from './AITeacherModal';
import { LessonModal } from './LessonModal';

interface ModuleProps {
    moduleKey: 'module1' | 'module2' | 'module3';
    onLessonClick: (lessonTitle: string) => void;
}

const Module: React.FC<ModuleProps> = ({ moduleKey, onLessonClick }) => {
    const { language } = useLanguage();
    const t = translations[language].astroAcademy[moduleKey];
    const [isExpanded, setIsExpanded] = useState(false);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    const toggleLessonComplete = (index: number) => {
        setCompletedLessons(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };
    
    const progress = Math.round((completedLessons.length / t.lessons.length) * 100);

    return (
        <div className="card-base p-6 rounded-2xl">
            <button className="flex justify-between items-center w-full text-left" onClick={() => setIsExpanded(!isExpanded)}>
                <h3 className="text-xl font-bold text-gray-100">{t.title}</h3>
                 <svg className={`w-6 h-6 text-violet-300 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{`${completedLessons.length}/${t.lessons.length} Lessons Completed`}</p>
            </div>
            {isExpanded && (
                <ul className="mt-6 space-y-3">
                    {t.lessons.map((lesson, index) => (
                        <li key={index} className="flex items-center group">
                           <input 
                                type="checkbox"
                                id={`${moduleKey}-lesson-${index}`}
                                checked={completedLessons.includes(index)}
                                onChange={() => toggleLessonComplete(index)}
                                className="h-5 w-5 rounded border-gray-500 text-violet-600 bg-gray-800 focus:ring-violet-500 cursor-pointer"
                           />
                           <button 
                                onClick={() => onLessonClick(lesson)}
                                className="ml-3 text-gray-300 cursor-pointer text-left group-hover:text-violet-300 transition-colors"
                           >
                            {lesson}
                           </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export const AstroAcademy: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].astroAcademy;
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

    const handleLessonClick = (lessonTitle: string) => {
        setSelectedLesson(lessonTitle);
        setIsLessonModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
            </div>
            
            <div className="space-y-6">
                <Module moduleKey="module1" onLessonClick={handleLessonClick} />
                <Module moduleKey="module2" onLessonClick={handleLessonClick} />
                <Module moduleKey="module3" onLessonClick={handleLessonClick} />
            </div>

            <div className="text-center pt-4">
                <button onClick={() => setIsTeacherModalOpen(true)} className="button-primary">
                    {translations[language].astroAcademy.aiTeacher.title}
                </button>
            </div>

            {isTeacherModalOpen && <AITeacherModal onClose={() => setIsTeacherModalOpen(false)} />}
            {isLessonModalOpen && selectedLesson && (
                <LessonModal 
                    lessonTitle={selectedLesson} 
                    onClose={() => setIsLessonModalOpen(false)} 
                />
            )}
        </div>
    );
};