
import React from 'react';

interface MoonPhaseGraphicProps {
    phaseName: string;
}

export const MoonPhaseGraphic: React.FC<MoonPhaseGraphicProps> = ({ phaseName }) => {
    const normalizedPhase = phaseName.toLowerCase();

    // Determine phase value (0 = new, 0.5 = full, 1 = new)
    let phaseValue = 0; 
    
    if (normalizedPhase.includes('new') || normalizedPhase.includes('nouă') || normalizedPhase.includes('nueva')) phaseValue = 0;
    else if (normalizedPhase.includes('waxing crescent') || normalizedPhase.includes('semilună în creștere')) phaseValue = 0.12;
    else if (normalizedPhase.includes('first quarter') || normalizedPhase.includes('primul pătrar')) phaseValue = 0.25;
    else if (normalizedPhase.includes('waxing gibbous') || normalizedPhase.includes('giboasă în creștere')) phaseValue = 0.37;
    else if (normalizedPhase.includes('full') || normalizedPhase.includes('plină') || normalizedPhase.includes('llena')) phaseValue = 0.5;
    else if (normalizedPhase.includes('waning gibbous') || normalizedPhase.includes('giboasă în descreștere')) phaseValue = 0.62;
    else if (normalizedPhase.includes('last quarter') || normalizedPhase.includes('ultimul pătrar')) phaseValue = 0.75;
    else if (normalizedPhase.includes('waning crescent') || normalizedPhase.includes('semilună în descreștere')) phaseValue = 0.87;
    else phaseValue = 0.5; // Default

    // Calculate shadow path using simple trigonometry projection
    // 100x100 coordinate system, center 50,50, radius 45
    const radius = 45;
    const cx = 50;
    const cy = 50;

    // This function approximates the terminator line for the moon shadow
    const getPath = (p: number) => {
        // p is 0 to 1
        // 0 = New Moon (all dark)
        // 0.5 = Full Moon (all light)
        // 1 = New Moon (all dark again)
        
        const isWaxing = p <= 0.5;
        const lightWidth = isWaxing ? p * 2 : (1 - p) * 2; // 0 to 1
        
        // The "bulge" of the terminator line. 
        // -1 = left edge, 0 = straight line, 1 = right edge
        const xOffset = (lightWidth - 0.5) * 2 * radius;
        
        // Arc direction depends on phase
        const sweep = isWaxing ? 1 : 0; // Determine side of light
        
        // Construct SVG path
        // Start top, arc to bottom (outer circle), curve back to top (terminator)
        if (p === 0.5) {
             // Full moon - simple circle
             return `M ${cx} ${cy-radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy+radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy-radius}`;
        }
        
        // Complex calculation for creating the terminator curve
        // Simplified for visual approximation:
        // We draw the light part.
        
        if (p < 0.5) {
            // Waxing: Light is on the RIGHT (for N. Hemisphere logic usually, but here we simplify)
            // Let's assume standard representation:
            // New -> Crescent (Right sliver) -> Quarter (Right half) -> Full
            
            // Actually, standard SVG moon icons usually fill the lit part.
            // Let's use a simpler mask logic but with better graphics than the previous circle-offset.
            
            // Using a path that draws a circle, but "squishes" one side
             const rx = Math.abs(radius * (1 - 4 * Math.abs(p - 0.25)));
             const sweepTerminator = p < 0.25 ? 0 : 1;
             
             return `M ${cx} ${cy-radius} 
                     A ${radius} ${radius} 0 0 1 ${cx} ${cy+radius} 
                     A ${rx} ${radius} 0 0 ${sweepTerminator} ${cx} ${cy-radius} Z`;
        } else {
             // Waning
             const rx = Math.abs(radius * (1 - 4 * Math.abs(p - 0.75)));
             const sweepTerminator = p < 0.75 ? 1 : 0;
             
              return `M ${cx} ${cy-radius} 
                     A ${radius} ${radius} 0 0 0 ${cx} ${cy+radius} 
                     A ${rx} ${radius} 0 0 ${sweepTerminator} ${cx} ${cy-radius} Z`;
        }
    };
    
    // Actually, simpler approach for "Google AI Studio" look:
    // Use a high-quality gradient circle and a semitransparent shadow overlay
    
    // Let's stick to a visually pleasing simple representation:
    // Light is #F5F3FF (violet-50), Shadow is #1E1B4B (indigo-950) opacity 80%
    
    return (
        <div className="relative w-32 h-32 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <radialGradient id="moonGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="90%" stopColor="#ddd6fe" />
                        <stop offset="100%" stopColor="#a78bfa" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Base Moon (Full Light) */}
                <circle cx="50" cy="50" r="48" fill="url(#moonGradient)" filter="url(#glow)" />
                
                {/* Shadow Overlay */}
                {/* We calculate shadow position based on phase */}
                {/* 0 = Full Shadow, 0.5 = No Shadow, 1 = Full Shadow */}
                {/* This is complex to do perfectly with SVG paths without a library, 
                    so we use a clever clip-path trick for the shadow */}
                
                {/* Render specific phase shadow based on value */}
                <g fill="#1e1b4b" fillOpacity="0.85" style={{ mixBlendMode: "multiply" }}>
                    {phaseValue === 0 && <circle cx="50" cy="50" r="48" />} {/* New Moon */}
                    {phaseValue > 0 && phaseValue < 0.5 && (
                        <path d={`M 50 2 A 48 48 0 0 0 50 98 A ${48 * (1 - phaseValue * 4)} 48 0 0 ${phaseValue < 0.25 ? 0 : 1} 50 2`} />
                    )}
                    {phaseValue > 0.5 && phaseValue < 1 && (
                        <path d={`M 50 2 A 48 48 0 0 1 50 98 A ${48 * (1 - (phaseValue - 0.5) * 4)} 48 0 0 ${phaseValue < 0.75 ? 1 : 0} 50 2`} />
                    )}
                </g>
                
                {/* Crater Details (Subtle) */}
                <circle cx="35" cy="35" r="8" fill="rgba(0,0,0,0.05)" />
                <circle cx="65" cy="60" r="12" fill="rgba(0,0,0,0.05)" />
                <circle cx="55" cy="25" r="5" fill="rgba(0,0,0,0.05)" />
            </svg>
        </div>
    );
};
