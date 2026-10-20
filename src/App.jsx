import React from 'react';
import { birthdayData } from './data/birthdayData';
import FloatingDecorations from './components/FloatingDecorations';
import MusicToggle from './components/MusicToggle';
import WelcomeScreen from './components/WelcomeScreen';
import BirthdayCake from './components/BirthdayCake';
import MemoryGallery from './components/MemoryGallery';
import SpecialMessage from './components/SpecialMessage';
import FinalCelebration from './components/FinalCelebration';

export function App() {
  const handleExplore = () => {
    const cakeElem = document.getElementById('birthday-cake');
    if (cakeElem) {
      cakeElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50/60 via-purple-50/40 to-amber-50/40 text-stone-800 antialiased selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
      {/* Background Floating Balloons & Glowing Sparkles */}
      <FloatingDecorations />

      {/* Floating Audio Control Pill */}
      <MusicToggle />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col w-full">
        {/* A. Animated Welcome Hero */}
        <WelcomeScreen data={birthdayData} onExplore={handleExplore} />

        {/* B. Interactive Birthday Cake with Candles & Wish Modal */}
        <BirthdayCake data={birthdayData} />

        {/* C. Interactive Memory Gallery (Photos & Video Clips) & Lightbox */}
        <MemoryGallery data={birthdayData} />

        {/* D. Special Birthday Message For Alalarice */}
        <SpecialMessage data={birthdayData} />

        {/* E. Final Birthday Celebration & Footer */}
        <FinalCelebration data={birthdayData} />
      </main>
    </div>
  );
}

export default App;
