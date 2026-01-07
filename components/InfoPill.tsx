import React from 'react';

interface InfoPillProps {
    label: string;
    value: string;
    size?: 'sm' | 'md';
}

export const InfoPill: React.FC<InfoPillProps> = ({ label, value, size = 'md' }) => {
    const sizeClasses = {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-2"
    };
    
    const labelClasses = {
        sm: "text-xs",
        md: "text-xs"
    }
    
    const valueClasses = {
        sm: "text-sm",
        md: "text-sm"
    }

    return (
        <div className={`card-base rounded-full text-center border-none ${sizeClasses[size]}`}>
            <span className={`${labelClasses[size]} text-violet-300 uppercase font-semibold tracking-wider`}>{label}{size === 'sm' ? ': ' : ''}</span>
            <p className={`${valueClasses[size]} text-white font-light ${size === 'sm' ? 'inline' : ''}`}>{value}</p>
        </div>
    );
};