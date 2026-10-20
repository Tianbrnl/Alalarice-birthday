import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confettiHelper';
import BirthdayAvatar from './BirthdayAvatar';

export const WelcomeScreen = ({ data, onExplore }) => {
  const handleOpenSurprise = () => {
    fireCelebrationConfetti();
    if (onExplore) {
      onExplore();
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-4xl mx-auto flex flex-col items-center z-10"
      >
        {/* Floating Sparkle Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-6 shadow-sm border border-pink-200/60"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            {data.welcome.badge}
          </span>
          <Sparkles className="w-4 h-4 text-pink-400" />
        </motion.div>

        {/* Heading & Animated Avatar Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 md:gap-8 mb-4 w-full"
        >
          {/* Greeting Text Block */}
          <div className="text-center sm:text-left flex flex-col justify-center max-w-xl">
            <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-800 tracking-tight leading-[1.12]">
              {data.welcome.title}{' '}
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm inline-block">
                {data.recipientName}!
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-pink-600 font-sans tracking-wide mt-2 sm:mt-3">
              {data.welcome.subtitle}
            </p>
          </div>

          {/* 10-Second 2D Animated Avatar beside name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="shrink-0 flex items-center justify-center"
          >
            <BirthdayAvatar name={data.recipientName} />
          </motion.div>
        </motion.div>

        {/* Description / Warm note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-stone-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed mb-8 px-2"
        >
          {data.welcome.description}
        </motion.p>

        {/* Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <button
            onClick={handleOpenSurprise}
            type="button"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-semibold text-base sm:text-lg shadow-xl shadow-pink-500/25 hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            <Heart className="w-5 h-5 text-white fill-white group-hover:scale-125 transition-transform duration-300" />
            <span>{data.welcome.ctaButton}</span>
            <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-14 sm:mt-16 flex flex-col items-center text-stone-400 gap-1.5 cursor-pointer"
          onClick={handleOpenSurprise}
        >
          <span className="text-xs uppercase tracking-widest font-medium text-stone-500">Scroll to Explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce text-pink-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WelcomeScreen;
