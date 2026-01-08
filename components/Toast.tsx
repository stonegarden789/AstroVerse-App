
import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-900/90 border-green-500',
        error: 'bg-red-900/90 border-red-500',
        info: 'bg-blue-900/90 border-blue-500'
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    return (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[150] px-6 py-3 rounded-full border shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in ${bgColors[type]}`}>
            <span>{icons[type]}</span>
            <span className="text-white font-medium text-sm">{message}</span>
        </div>
    );
};
