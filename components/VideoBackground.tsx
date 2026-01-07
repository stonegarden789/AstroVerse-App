import React from 'react';

// Using a high-quality, royalty-free video from sources like Pixabay or Pexels.
const VIDEO_URL = 'https://videos.pexels.com/video-files/856945/856945-hd_1920_1080_25fps.mp4';

export const VideoBackground: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src={VIDEO_URL}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-violet-400/30"></div>
        </div>
    );
};