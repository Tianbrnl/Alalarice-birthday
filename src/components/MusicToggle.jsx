import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { musicBox } from '../utils/musicHelper';

export const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    const nextState = musicBox.toggle();
    setIsPlaying(nextState);
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      musicBox.stop();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleMusic}
        type="button"
        aria-label={isPlaying ? 'Pause birthday music' : 'Play sweet birthday music'}
        className="glass-pill px-3.5 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-stone-700 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[44px] min-w-[44px]"
      >
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <Volume2 className="w-5 h-5 text-pink-600 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <VolumeX className="w-5 h-5 text-stone-400" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium tracking-wide hidden sm:inline-block">
          {isPlaying ? 'Music On ♫' : 'Play Melody'}
        </span>
      </button>
    </div>
  );
};

export default MusicToggle;
