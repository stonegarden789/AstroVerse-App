
import React from 'react';
import type { BirthData } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { getEnergeticProfile } from '../utils/calculators';

interface EnergeticAlignmentProps {
    birthData: BirthData;
}

export const EnergeticAlignment: React.FC<EnergeticAlignmentProps> = ({ birthData }) => {
    const { language } = useLanguage();
    const t = translations[language].energeticAlignment;
    
    if (!birthData.date) return null;

    // Pass language to the calculator to get localized strings
    const profile = getEnergeticProfile(birthData.date, language);

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
                <p className="text-gray-400 mt-2">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Power Color Card */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 p-6 flex flex-col items-center text-center space-y-4" style={{ background: `linear-gradient(to bottom right, #1a1b3c, ${profile.hex}33)` }}>
                    <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl font-bold text-white">{profile.lifePath}</div>
                    
                    <div className="w-24 h-24 rounded-full shadow-2xl border-4 border-white/20" style={{ backgroundColor: profile.hex, boxShadow: `0 0 30px ${profile.hex}` }}></div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{t.labels.powerColor}</h3>
                        <p className="text-2xl font-bold" style={{ color: profile.hex }}>{profile.powerColor}</p>
                        <p className="text-sm text-gray-300 mt-2 italic">{t.labels.lifePath}: {profile.lifePath}</p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg w-full">
                        <p className="text-sm font-semibold text-violet-200 uppercase tracking-wider mb-2">{t.labels.benefits}</p>
                        <p className="text-gray-200">{profile.colorBenefit}</p>
                    </div>
                </div>

                {/* Crystal Card */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-br from-gray-900 to-violet-900/40">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-bold text-white uppercase">{profile.zodiac}</div>
                    
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl bg-white/5 border-2 border-white/10 shadow-lg">
                        💎
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{t.labels.crystal}</h3>
                        <p className="text-2xl font-bold text-violet-300">{profile.crystal}</p>
                        <p className="text-sm text-gray-300 mt-2 italic">{t.labels.zodiac}: {profile.zodiac}</p>
                    </div>

                    <div className="bg-black/30 p-4 rounded-lg w-full">
                         <p className="text-sm font-semibold text-violet-200 uppercase tracking-wider mb-2">{t.labels.benefits}</p>
                        <p className="text-gray-200">{profile.crystalBenefit}</p>
                    </div>
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-black/20 p-6 rounded-xl border-l-4 border-violet-500">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>✨</span> {t.labels.tips}
                </h3>
                <ul className="space-y-3">
                    {profile.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <span className="text-violet-400 mt-1">✦</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
