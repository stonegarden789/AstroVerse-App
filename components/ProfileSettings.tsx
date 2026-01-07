
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations, SUPPORTED_LANGUAGES, LANGUAGE_NAMES, CURRENCIES } from '../constants';
import type { Currency } from '../types';

const ToggleSwitch: React.FC<{ label: string }> = ({ label }) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">{label}</span>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 ${
                    isOn ? 'bg-violet-600' : 'bg-gray-600'
                }`}
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                        isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};

export const ProfileSettings: React.FC = () => {
    const { language, setLanguage, reportLanguage, setReportLanguage, currency, setCurrency } = useLanguage();
    const t = translations[language];

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.profile.title}</h2>
            </div>

            {/* Language & Region Settings */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-200 border-b border-white/10 pb-2">{t.profile.languageTitle}</h3>
                
                {/* App Language (Compact Buttons) */}
                <div className="flex justify-center gap-3">
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`w-12 h-12 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                                language === lang 
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40 scale-110 ring-2 ring-violet-300' 
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Advanced Localization Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Report Output Language */}
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t.profile.reportLanguageLabel}</label>
                        <select 
                            value={reportLanguage}
                            onChange={(e) => setReportLanguage(e.target.value as any)}
                            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded px-3 py-2 outline-none focus:border-violet-500"
                        >
                            {SUPPORTED_LANGUAGES.map(lang => (
                                <option key={lang} value={lang}>{LANGUAGE_NAMES[lang]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Currency */}
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t.profile.currencyLabel}</label>
                        <select 
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as any)}
                            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded px-3 py-2 outline-none focus:border-violet-500"
                        >
                            {Object.keys(CURRENCIES).map((curr) => (
                                <option key={curr} value={curr}>{CURRENCIES[curr as Currency].label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
                 <div>
                    <h3 className="text-xl font-bold text-gray-200">{t.profile.notificationsTitle}</h3>
                    <p className="text-sm text-gray-400 mt-1">{t.profile.notificationsSubtitle}</p>
                </div>
                <div className="space-y-3 opacity-50 cursor-not-allowed">
                    <ToggleSwitch label={t.profile.dailyHoroscope} />
                    <ToggleSwitch label={t.profile.specialReports} />
                    <ToggleSwitch label={t.profile.featureUpdates} />
                </div>
            </div>
        </div>
    );
};
