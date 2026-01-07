
import React, { useState, useEffect } from 'react';
import type { AppView, BirthData, CognitiveProfile } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateDailyDashboard } from '../services/geminiService';
import { Spinner } from './Spinner';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  birthData: BirthData | null; // Allow null to handle the case before data is submitted
  cognitiveProfile: CognitiveProfile | null;
}

interface DailyData {
    focus: string;
    moon: string;
    card: {
        title: string;
        message: string;
    };
}

// Utility to strictly remove HTML tags AND emojis for clean dashboard text
const cleanText = (text: string) => {
    if (!text) return "";
    // Remove specific HTML tags that might sneak in
    let cleaned = text.replace(/<\/?strong>/gi, '');
    cleaned = cleaned.replace(/<\/?em>/gi, '');
    cleaned = cleaned.replace(/<\/?b>/gi, '');
    cleaned = cleaned.replace(/<br\s*\/?>/gi, ' ');
    // Remove Markdown bold/italic and asterisks
    cleaned = cleaned.replace(/\*\*|__/g, '').replace(/\*|_/g, '');
    // Trim
    return cleaned.trim();
}

const FeatureCard: React.FC<{ title: string; description: string; onClick: () => void, icon: React.ReactNode, disabled?: boolean, disabledTooltip?: string }> = ({ title, description, onClick, icon, disabled = false, disabledTooltip }) => {
    // Strip emojis from title to prevent double icons (since we have SVG icons)
    const cleanTitle = title.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

    const cardContent = (
        <div 
            onClick={!disabled ? onClick : undefined}
            className={`card-base p-6 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-violet-400/50 hover:-translate-y-1 group'}`}
        >
            <div className="text-violet-400 flex-shrink-0">{icon}</div>
            <div>
                <h3 className={`text-xl font-bold text-gray-100 ${!disabled && 'group-hover:celestial-title'} transition-colors`}>{cleanTitle}</h3>
                <p className="text-gray-400 mt-1 text-sm">{description}</p>
            </div>
        </div>
    );

    if (disabled && disabledTooltip) {
        return (
            <div className="relative group">
                {cardContent}
                <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {disabledTooltip}
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        )
    }

    return cardContent;
};


// ICONS
const NatalChartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12a4 4 0 118 0 4 4 0 01-8 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>);
const FutureIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
const CompatibilityIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
const DailyZodiacIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const OracleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>);
const DreamIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-1.414a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072m-7.072 0l-2.121 2.121m7.072-7.072l2.121-2.121M12 6.343l2.121-2.121m0 0l2.121 2.121m-2.121-2.121l-2.121 2.121" /></svg>);
const VocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18" /></svg>);
const ProfilerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m-7-7h14" /></svg>);
const DecisionIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l7 7-7 7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 19V6l7 7-7 7z" /></svg>);
const AcademyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.176 1.156a51.137 51.137 0 002.176-.928m15.482 0l2.176 1.156a51.139 51.139 0 01-2.176-.928" /></svg>);
const CognitiveScaleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.25 13l.648 1.938a3.375 3.375 0 002.672 2.672L21 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" /></svg>);
const NumerologyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.5h-3.031a1.5 1.5 0 01-1.5-1.5V16.5m0 0a1.5 1.5 0 011.5-1.5h5.25m-5.25 0V9a1.5 1.5 0 011.5-1.5h3.031m0 0v1.5a1.5 1.5 0 01-1.5 1.5H9.75m0 0a1.5 1.5 0 01-1.5-1.5V5.625a1.5 1.5 0 011.5-1.5h3.031m0 0a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5H9.75m-3.75 0a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a1.5 1.5 0 00-1.5-1.5h-3.75" /></svg>);
const TarotIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.81m5.84-2.57a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.25a14.98 14.98 0 00-5.84 7.38m5.84 2.57a14.98 14.98 0 017.38 5.84m-13.22 0a14.98 14.98 0 01-5.84-7.38 14.98 14.98 0 012.25-9.63m4.81 12.12a14.98 14.98 0 01-7.38-5.84m13.22 0a14.98 14.98 0 00-2.25-9.63" /></svg>);
const ConnectionsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.542 2.72a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72M12 18.72V21m-1.657-9.343A12.025 12.025 0 0112 6a12.025 12.025 0 013.657 3.377M12 6v4.5m-3.657 3.377A12.025 12.025 0 0012 21a12.025 12.025 0 003.657-3.377M12 21v-4.5" /></svg>);
const AstroViewIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);
const CrystalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l-7.5 7.5M12 2.25l7.5 7.5" /></svg>);
const BioIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>);
const DragonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 2.75c-2.302 0-4.45.669-6.257 1.819m16.514 0A8.252 8.252 0 0012 2.75c-2.302 0-4.45.669-6.257 1.819m16.514 0A8.255 8.255 0 0112 9a8.255 8.255 0 01-6.257-2.686m16.514 0c.21.36.402.736.574 1.125m-17.662 0A9 9 0 0012 18v0a9 9 0 006.257-2.686m-12.514 0c-.21.36-.402.736-.574 1.125m17.662 0A8.252 8.252 0 0112 21.25c-2.302 0-4.45-.669-6.257-1.819m16.514 0c.21.36.402.736.574 1.125m0 0a9.006 9.006 0 01-1.743 2.228m0 0H12M5.743 2.75h.001" /></svg>);
const ExtendedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>);


export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, birthData, cognitiveProfile }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [dailyData, setDailyData] = useState<DailyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!birthData) {
            setIsLoading(false);
            return;
        }

        const fetchDailyData = async () => {
            setIsLoading(true);
            try {
                const data = await generateDailyDashboard(birthData, language);
                setDailyData(data);
            } catch (error) {
                console.error("Failed to load daily dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDailyData();
    }, [birthData, language]);

  return (
    <div className="space-y-12 animate-fade-in">
        <div className="text-center">
            <h2 className="text-4xl font-bold celestial-title">{t.dashboard.title}</h2>
            <p className="text-lg text-gray-400 mt-2">{t.dashboard.subtitle}</p>
        </div>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center h-48 card-base rounded-2xl"><Spinner /></div>
        ) : dailyData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-base p-6 rounded-2xl text-center">
                    <h3 className="font-bold text-lg celestial-title">{t.dashboard.dynamic.focusTitle}</h3>
                    <p className="text-gray-200 mt-2 text-md">{cleanText(dailyData.focus)}</p>
                </div>
                <div className="card-base p-6 rounded-2xl text-center">
                    <h3 className="font-bold text-lg celestial-title">{t.dashboard.dynamic.moonTitle}</h3>
                    <p className="text-gray-200 mt-2 text-md">{cleanText(dailyData.moon)}</p>
                </div>
                <div className="card-base p-6 rounded-2xl text-center">
                    <h3 className="font-bold text-lg celestial-title">{t.dashboard.dynamic.cardTitle}</h3>
                    <p className="text-gray-100 mt-2 text-md font-maharlika">{cleanText(dailyData.card.title)}</p>
                    <p className="text-xs text-gray-400 mt-1">"{cleanText(dailyData.card.message)}"</p>
                </div>
            </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title={t.dashboard.natalChart.title} description={t.dashboard.natalChart.description} onClick={() => onNavigate('natalChart')} icon={<NatalChartIcon />} />
            <FeatureCard title={t.dashboard.extendedProfile.title} description={t.dashboard.extendedProfile.description} onClick={() => onNavigate('extendedProfile')} icon={<ExtendedIcon />} />
            <FeatureCard title={t.dashboard.energeticAlignment.title} description={t.dashboard.energeticAlignment.description} onClick={() => onNavigate('energeticAlignment')} icon={<CrystalIcon />} />
            <FeatureCard title={t.dashboard.bioRhythms.title} description={t.dashboard.bioRhythms.description} onClick={() => onNavigate('bioRhythms')} icon={<BioIcon />} />
            <FeatureCard title={t.dashboard.chineseZodiac.title} description={t.dashboard.chineseZodiac.description} onClick={() => onNavigate('chineseZodiac')} icon={<DragonIcon />} />
            <FeatureCard title={t.dashboard.askTheOracle.title} description={t.dashboard.askTheOracle.description} onClick={() => onNavigate('askTheOracle')} icon={<OracleIcon />} />
            <FeatureCard title={t.dashboard.dreamInterpretation.title} description={t.dashboard.dreamInterpretation.description} onClick={() => onNavigate('dreamInterpretation')} icon={<DreamIcon />} />
            <FeatureCard title={t.dashboard.astroView.title} description={t.dashboard.astroView.description} onClick={() => onNavigate('astroView')} icon={<AstroViewIcon />} />
            <FeatureCard title={t.dashboard.vocationalReport.title} description={t.dashboard.vocationalReport.description} onClick={() => onNavigate('vocationalReport')} icon={<VocationIcon />} />
            <FeatureCard title={t.dashboard.integralNumerology.title} description={t.dashboard.integralNumerology.description} onClick={() => onNavigate('integralNumerology')} icon={<NumerologyIcon />} />
            <FeatureCard title={t.dashboard.tarotOracle.title} description={t.dashboard.tarotOracle.description} onClick={() => onNavigate('tarotOracle')} icon={<TarotIcon />} />
            <FeatureCard title={t.dashboard.cognitiveProfiler.title} description={t.dashboard.cognitiveProfiler.description} onClick={() => onNavigate('cognitiveProfiler')} icon={<ProfilerIcon />} />
            <FeatureCard 
                title={t.dashboard.decisionMatrix.title} 
                description={t.dashboard.decisionMatrix.description} 
                onClick={() => onNavigate('decisionMatrix')} 
                icon={<DecisionIcon />} 
                disabled={!cognitiveProfile}
                disabledTooltip={t.dashboard.decisionMatrix.disabledTooltip}
            />
            <FeatureCard title={t.dashboard.aiFuture.title} description={t.dashboard.aiFuture.description} onClick={() => onNavigate('aiFuture')} icon={<FutureIcon />} />
            <FeatureCard title={t.dashboard.compatibility.title} description={t.dashboard.compatibility.description} onClick={() => onNavigate('compatibility')} icon={<CompatibilityIcon />} />
            <FeatureCard title={t.dashboard.dailyZodiac.title} description={t.dashboard.dailyZodiac.description} onClick={() => onNavigate('dailyZodiac')} icon={<DailyZodiacIcon />} />
            <FeatureCard title={t.dashboard.astroAcademy.title} description={t.dashboard.astroAcademy.description} onClick={() => onNavigate('astroAcademy')} icon={<AcademyIcon />} />
            <FeatureCard title={t.dashboard.integralNeuroEmotiveProfile.title} description={t.dashboard.integralNeuroEmotiveProfile.description} onClick={() => onNavigate('integralNeuroEmotiveProfile')} icon={<CognitiveScaleIcon />} />
            <FeatureCard title={t.dashboard.astroConnections.title} description={t.dashboard.astroConnections.description} onClick={() => onNavigate('astroConnections')} icon={<ConnectionsIcon />} />
        </div>
    </div>
  );
};
