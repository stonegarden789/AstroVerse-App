
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import { generateConstellationData, generateImageWithPrompt } from '../services/geminiService';
import { Spinner } from './Spinner';
import { MarkdownRenderer } from './MarkdownRenderer';
import { InfoPill } from './InfoPill';
import { AudioPlayer } from './AudioPlayer';
import { ShareButton } from './ShareButton';

export const AstroView: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].astroView;

    const [constellation, setConstellation] = useState('');
    const [data, setData] = useState<any | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Image Generation State
    const [isGeneratingArt, setIsGeneratingArt] = useState(false);
    const [generatedArt, setGeneratedArt] = useState<string | null>(null);

    const handleReveal = useCallback(async () => {
        if (!constellation.trim()) return;
        setIsLoadingData(true);
        setError(null);
        setData(null);
        setGeneratedArt(null);

        try {
            const result = await generateConstellationData(constellation, language);
            setData(result);
        } catch (err) {
            console.error(err);
            setError(translations[language].error.reading);
        } finally {
            setIsLoadingData(false);
        }
    }, [constellation, language]);

    const handleGenerateArt = async () => {
        if (!data || !data.assets_monetizare?.prompt_grafic_premium) return;
        setIsGeneratingArt(true);
        try {
            const resultBase64 = await generateImageWithPrompt(data.assets_monetizare.prompt_grafic_premium, '16:9');
            setGeneratedArt(`data:image/jpeg;base64,${resultBase64}`);
        } catch (err) {
            console.error("Art generation failed:", err);
            // Optionally set an error state specific to art
        } finally {
            setIsGeneratingArt(false);
        }
    };

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl space-y-8 animate-fade-in min-h-[70vh]">
            <div className="text-center">
                <h2 className="text-3xl font-bold celestial-title">{t.title}</h2>
            </div>

            {/* Input Section */}
            {!data && !isLoadingData && (
                <div className="max-w-md mx-auto space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t.inputLabel}</label>
                        <input
                            type="text"
                            value={constellation}
                            onChange={(e) => setConstellation(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleReveal()}
                            placeholder={t.inputPlaceholder}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-400 outline-none placeholder-gray-500"
                        />
                    </div>
                    <button onClick={handleReveal} disabled={!constellation.trim()} className="button-primary w-full py-3">
                        {t.button}
                    </button>
                </div>
            )}

            {isLoadingData && (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner />
                    <p className="mt-4 text-violet-300 animate-pulse">{translations[language].loading}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center">
                    <strong className="font-bold">{translations[language].error.title}</strong>
                    <p>{error}</p>
                    <button onClick={() => { setError(null); setData(null); }} className="mt-4 text-sm underline">Try Again</button>
                </div>
            )}

            {data && !isLoadingData && (
                <div className="space-y-8 animate-fade-in">
                    {/* Header Info */}
                    <div className="text-center space-y-2 pb-6 border-b border-white/10">
                        <div className="text-6xl animate-pulse-glow mb-4">{data.identitate_constelatie.simbol_emoji}</div>
                        <h3 className="text-4xl font-bold text-white font-garamond">{data.identitate_constelatie.nume_oficial}</h3>
                        <p className="text-violet-300 text-sm tracking-widest uppercase font-semibold">{data.identitate_constelatie.clasificare_iau}</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                             <span className="px-3 py-1 rounded-full bg-violet-900/50 border border-violet-500/30 text-xs font-bold text-violet-200 uppercase tracking-wider">
                                {data.identitate_constelatie.tipologie}
                             </span>
                             <span className="px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-xs font-bold text-blue-200 uppercase tracking-wider">
                                {data.identitate_constelatie.ranking_dimensiune}
                             </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Archetype Extended */}
                        <div className="card-base p-6 rounded-xl border border-violet-500/20">
                            <h4 className="text-xl font-bold celestial-title mb-4 border-b border-white/10 pb-2">{t.sections.archetype}</h4>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-gray-400 text-xs block">Element</span>
                                        <span className="text-white font-semibold">{data.astrologie_si_arhetip.element}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-xs block">Polaritate</span>
                                        <span className="text-white font-semibold">{data.astrologie_si_arhetip.polaritate}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-xs block">Guvernator</span>
                                        <span className="text-white font-semibold">{data.astrologie_si_arhetip.planeta_guvernatoare}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-xs block">Casa</span>
                                        <span className="text-white font-semibold">{data.astrologie_si_arhetip.casa_asociata}</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-white/5 mt-2">
                                    <p className="text-sm text-gray-300 italic">"{data.astrologie_si_arhetip.cuvinte_cheie_arhetip}"</p>
                                </div>
                            </div>
                        </div>

                        {/* Observing Guide Extended */}
                         <div className="card-base p-6 rounded-xl border border-violet-500/20">
                            <h4 className="text-xl font-bold celestial-title mb-4 border-b border-white/10 pb-2">{t.sections.observing}</h4>
                             <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Sezon Optim:</span>
                                    <span className="text-white font-semibold">{data.ghid_observare_pro.sezon_optim_nord}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ascensie (RA):</span>
                                    <span className="text-white font-mono">{data.ghid_observare_pro.ascensie_dreapta_ra}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Declinație (Dec):</span>
                                    <span className="text-white font-mono">{data.ghid_observare_pro.declinatie_dec}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Suprafață:</span>
                                    <span className="text-white">{data.ghid_observare_pro.suprafata_grade}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Dificultate:</span>
                                    <span className={`font-bold ${data.ghid_observare_pro.grad_dificultate.includes('Ușor') ? 'text-green-400' : 'text-yellow-400'}`}>{data.ghid_observare_pro.grad_dificultate}</span>
                                </div>
                                <div className="pt-2 bg-black/20 p-2 rounded mt-2">
                                    <p className="text-xs text-gray-400 mb-1">Cel mai bun moment:</p>
                                    <p className="text-violet-200 font-semibold">{data.ghid_observare_pro.moment_optim_vizibilitate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Celestial Bodies Extended */}
                    <div>
                        <h4 className="text-xl font-bold celestial-title mb-4 text-center">{t.sections.bodies}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {data.corpuri_celesti_exlcusive.map((body: any, idx: number) => (
                                <div key={idx} className="bg-gray-800/50 p-4 rounded-lg border border-white/5 hover:border-violet-500/30 transition-colors flex flex-col justify-between h-full">
                                    <div>
                                        <h5 className="font-bold text-white text-base">{body.nume}</h5>
                                        <p className="text-[10px] text-violet-300 uppercase tracking-wide mb-2">{body.distinctie}</p>
                                    </div>
                                    <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-white/5">
                                        <p>Mag: <span className="text-white">{body.magnitudine}</span></p>
                                        <p>Spec: <span className="text-white">{body.tip_spectral}</span></p>
                                        <p>Dist: {body.distanta}</p>
                                        <p>Culoare: <span style={{color: body.culoare_vizuala.includes('Roșu') ? '#f87171' : body.culoare_vizuala.includes('Albastru') ? '#60a5fa' : '#fbbf24'}}>{body.culoare_vizuala}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Narrative & Science */}
                    <div className="card-base p-6 rounded-xl border-none bg-gradient-to-br from-gray-900 to-black">
                        <h4 className="text-xl font-bold celestial-title mb-4">{t.sections.narrative}</h4>
                        <div className="text-gray-300 leading-relaxed mb-6">
                            <MarkdownRenderer content={data.context_narativ.mitul_fondator} className="markdown-content" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-violet-900/20 border-l-4 border-violet-500 p-4 text-sm">
                                <strong className="text-violet-300 block mb-2 text-base">{t.sections.astrophysics}</strong>
                                <p className="text-gray-300">{data.context_narativ.astrofizica_explicata}</p>
                            </div>
                            <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-4 text-sm">
                                <strong className="text-emerald-300 block mb-2 text-base">{t.sections.personalAlignment}</strong>
                                <p className="text-gray-300">{data.context_narativ.aliniere_personala}</p>
                            </div>
                        </div>
                        
                         <div className="mt-6 flex gap-4 justify-end border-t border-white/10 pt-4">
                            <AudioPlayer textToSpeak={`${data.identitate_constelatie.nume_oficial}. ${data.context_narativ.mitul_fondator}. ${data.context_narativ.astrofizica_explicata}`} />
                            <ShareButton shareText={`${data.identitate_constelatie.nume_oficial}\n\n${data.context_narativ.mitul_fondator}`} shareTitle={data.identitate_constelatie.nume_oficial} />
                        </div>
                    </div>

                    {/* Premium Art Generation */}
                    <div className="pt-8 border-t border-white/10">
                        <h4 className="text-2xl font-bold celestial-title text-center mb-2">{t.sections.art}</h4>
                        <p className="text-center text-gray-400 text-sm mb-6 max-w-2xl mx-auto">{data.assets_monetizare.descriere_imagine_galerie}</p>
                        
                        {!generatedArt ? (
                            <div className="text-center">
                                <button 
                                    onClick={handleGenerateArt} 
                                    disabled={isGeneratingArt}
                                    className="button-primary px-8 py-4 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-900/20"
                                >
                                    {isGeneratingArt ? (
                                        <span className="flex items-center gap-2">
                                            <Spinner /> Generating Map...
                                        </span>
                                    ) : (
                                        t.generateArtButton
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 text-center animate-fade-in">
                                <div className="relative inline-block group rounded-xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-white/10">
                                    <img src={generatedArt} alt="Constellation Map" className="max-w-full max-h-[600px] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                        <p className="text-white font-garamond italic text-lg">{data.identitate_constelatie.nume_oficial} Star Map</p>
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => setGeneratedArt(null)}
                                        className="text-gray-400 hover:text-white underline text-sm"
                                    >
                                        Generate New Map
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center pt-8">
                         <button onClick={() => { setData(null); setConstellation(''); }} className="text-gray-400 hover:text-white transition-colors">
                            &larr; Research Another Constellation
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
};
