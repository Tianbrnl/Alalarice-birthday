import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, RotateCcw, PartyPopper } from 'lucide-react';
import { fireCelebrationConfetti, fireSideCannons, fireStarBurst } from '../utils/confettiHelper';

export const FinalCelebration = ({ data }) => {
  const handleCelebrateAgain = () => {
    fireCelebrationConfetti();
    fireSideCannons();
    fireStarBurst();

    // Smoothly scroll back to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative py-20 sm:py-28 px-4 overflow-hidden text-center">
      {/* Background radial glow */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-pink-100/60 via-purple-100/30 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-pink-500/25 mb-6"
        >
          <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-200" />
        </motion.div>

        {/* Large Grand Finale Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-stone-800 mb-4 tracking-tight leading-tight"
        >
          {data.celebration.title}
        </motion.h2>

        {/* Subtitle / Wish */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg sm:text-2xl text-pink-600 font-medium font-sans mb-3"
        >
          {data.celebration.subtitle}
        </motion.p>

        {/* Closing Warm Message */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed mb-10"
        >
          {data.celebration.closingWish}
        </motion.p>

        {/* Celebrate Again CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <button
            onClick={handleCelebrateAgain}
            type="button"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-semibold text-base sm:text-lg shadow-xl shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/40 transition-all min-h-[48px]"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
            <span>{data.celebration.replayButton}</span>
            <Sparkles className="w-5 h-5 text-amber-200" />
          </button>
        </motion.div>

        {/* Footer Credit */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-pink-200/50 w-full flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs sm:text-sm text-stone-500 font-light">
          <span>{data.celebration.footerText}</span>
          <span className="font-semibold text-pink-600 flex items-center gap-1">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            {data.senderName}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Celebrating {data.recipientName}</span>
        </div>
      </div>
    </footer>
  );
};

export default FinalCelebration;
