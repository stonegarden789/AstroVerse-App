
import React, { useMemo } from 'react';
import type { BirthData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { calculateBiorhythms, BioRhythmCycle } from '../utils/calculators';

interface BioRhythmsProps {
    birthData: BirthData;
}

const ProgressBar: React.FC<{ label: string, cycle: BioRhythmCycle, colorClass: string, states: any }> = ({ label, cycle, colorClass, states }) => {
    // Determine state text based on key (Peak, Low, etc)
    const stateText = states[cycle.state.toLowerCase()] || cycle.state;
    
    return (
        <div className="mb-6 group">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-base font-bold text-white">{label}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded bg-gray-800 ${cycle.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stateText}
                    </span>
                </div>
                <span className="text-sm font-mono text-gray-300">{cycle.percentage}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden relative border border-white/5">
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 z-10"></div>
                
                {/* Bar */}
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${colorClass} ${cycle.value > 0.8 || cycle.value < -0.8 ? 'animate-pulse' : ''}`}
                    style={{ width: `${cycle.percentage}%` }}
                ></div>
            </div>
            {cycle.state === 'Critical' && (
                <p className="text-xs text-red-400 mt-1">⚠️ Critical Transition Day - Take Extra Care</p>
            )}
        </div>
    );
};

export const BioRhythms: React.FC<BioRhythmsProps> = ({ birthData }) => {
    const { language } = useLanguage();
    const t = translations[language].bioRhythms;
    
    const rhythms = useMemo(() => calculateBiorhythms(birthData.date), [birthData.date]);
    
    // Simple interpretation logic
    const getInterpretation = () => {
        const avg = (rhythms.physical.value + rhythms.emotional.value + rhythms.intellectual.value) / 3;
        if (avg > 0.5) return "Overall, your energies are high. Great time for action and creativity.";
        if (avg < -0.5) return "Your cycles are in a recharge phase. Rest and introspection are favored.";
        return "Your energies are balanced or mixed. Navigate the day with steady awareness.";
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                <p className="text-gray-400 mt-2">{t.subtitle}</p>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                <ProgressBar 
                    label={t.labels.physical} 
                    cycle={rhythms.physical} 
                    colorClass="bg-gradient-to-r from-red-900 to-red-500"
                    states={t.states}
                />
                <ProgressBar 
                    label={t.labels.emotional} 
                    cycle={rhythms.emotional} 
                    colorClass="bg-gradient-to-r from-blue-900 to-blue-500"
                    states={t.states}
                />
                <ProgressBar 
                    label={t.labels.intellectual} 
                    cycle={rhythms.intellectual} 
                    colorClass="bg-gradient-to-r from-green-900 to-green-500"
                    states={t.states}
                />
            </div>
            
            <div className="text-center p-4 bg-violet-900/10 rounded-lg border border-violet-500/20">
                <p className="text-lg text-violet-200 italic font-serif">"{getInterpretation()}"</p>
            </div>
        </div>
    );
};
