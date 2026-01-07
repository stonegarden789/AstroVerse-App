import React from 'react';

export const AdBanner: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full h-[50px] bg-gray-900/90 backdrop-blur-sm border-t border-white/10 z-40 flex items-center justify-center">
            <div className="text-center">
                <p className="text-sm text-gray-400">Advertisement Banner (320x50)</p>
            </div>
        </div>
    );
};
