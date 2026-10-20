import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Wind, Sparkles, Wand2, Heart, Mic, MicOff, Loader2 } from 'lucide-react';
import { fireCelebrationConfetti, fireStarBurst } from '../utils/confettiHelper';
import { useBlowDetection } from '../hooks/useBlowDetection';

export const BirthdayCake = ({ data }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlown, setIsBlown] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const [customWish, setCustomWish] = useState('');
  const [wishConfirmed, setWishConfirmed] = useState(false);
  const [showWishModal, setShowWishModal] = useState(false);

  // Handle blowing out the candles
  const handleBlowCandles = useCallback(() => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setShowSmoke(true);
    setIsBlown(true);

    // Trigger confetti bursts
    fireCelebrationConfetti();
    fireStarBurst();

    setTimeout(() => {
      setShowSmoke(false);
    }, 2200);
  }, [candlesLit]);

  // Relight the candles
  const handleRelight = () => {
    setCandlesLit(true);
    setShowSmoke(false);
  };

  // Submit custom wish
  const handleSaveWish = (e) => {
    e.preventDefault();
    if (customWish.trim()) {
      setWishConfirmed(true);
      setShowWishModal(false);
      fireStarBurst();
    }
  };

  // Microphone blow detection
  const {
    micStatus,
    isListening,
    blowDetected,
    enableMicrophone,
    stopListening,
  } = useBlowDetection({
    onBlow: handleBlowCandles,
    threshold: 1.6,
    duration: 400,
    cooldown: 2000,
  });

  // Mic button label and icon logic
  const getMicButtonContent = () => {
    switch (micStatus) {
      case 'requesting':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          label: 'Requesting…',
          disabled: true,
        };
      case 'calibrating':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin text-amber-300" />,
          label: 'Calibrating…',
          disabled: true,
        };
      case 'listening':
        return {
          icon: <MicOff className="w-4 h-4" />,
          label: 'Stop Mic',
          disabled: false,
        };
      case 'denied':
        return {
          icon: <MicOff className="w-4 h-4 text-red-300" />,
          label: 'Mic Denied',
          disabled: true,
        };
      case 'unsupported':
        return {
          icon: <MicOff className="w-4 h-4 text-stone-400" />,
          label: 'Not Available',
          disabled: true,
        };
      case 'error':
        return {
          icon: <MicOff className="w-4 h-4 text-red-300" />,
          label: 'Mic Error',
          disabled: true,
        };
      default: // 'idle'
        return {
          icon: <Mic className="w-4 h-4" />,
          label: 'Use Mic to Blow',
          disabled: false,
        };
    }
  };

  const micBtn = getMicButtonContent();

  return (
    <section id="birthday-cake" className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{data.cake.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-3">
            {data.cake.heading}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light">
            {data.cake.subtitle}
          </p>
        </div>

        {/* Interactive Cake Illustration Box */}
        <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-end h-80 sm:h-96 pb-4">
          {/* Subtle Ambient Cake Glow */}
          <div
            className={`absolute top-1/4 w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 ${
              candlesLit ? 'bg-amber-200/50 opacity-100' : 'bg-stone-200/20 opacity-0'
            }`}
          />

          {/* Candles Container */}
          <div className="relative z-20 flex justify-center items-end gap-6 sm:gap-9 mb-1">
            {[0, 1, 2].map((candleIndex) => (
              <div key={candleIndex} className="relative flex flex-col items-center">
                {/* Flame or Smoke */}
                <div className="h-10 flex items-end justify-center mb-0.5">
                  <AnimatePresence mode="wait">
                    {candlesLit ? (
                      <motion.div
                        key="flame"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="candle-flame relative flex items-center justify-center"
                      >
                        {/* Outer Glow */}
                        <div className="w-5 h-8 sm:w-6 sm:h-9 rounded-[50%_50%_40%_40%_/_70%_70%_30%_30%] bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
                        {/* Inner Core */}
                        <div className="absolute bottom-1 w-2.5 h-4 rounded-full bg-white/90 blur-[0.4px]" />
                      </motion.div>
                    ) : showSmoke ? (
                      <motion.div
                        key="smoke"
                        className="smoke-particle flex flex-col items-center"
                      >
                        <div className="w-3 h-5 bg-stone-400/50 rounded-full blur-[2px]" />
                        <div className="w-4 h-6 -mt-2 bg-stone-300/40 rounded-full blur-[3px]" />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2.5 bg-stone-700 rounded-t-sm" />

                {/* Candle Stick */}
                <div
                  className={`w-3.5 sm:w-4 ${
                    candleIndex === 1 ? 'h-14 sm:h-16' : 'h-12 sm:h-14'
                  } rounded-t-sm bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 shadow-sm border border-pink-200/50 relative overflow-hidden`}
                >
                  {/* Candle Spiral Stripes */}
                  <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,white_4px,white_8px)]" />
                </div>
              </div>
            ))}
          </div>

          {/* Tier 1 (Top Tier) */}
          <div className="relative z-10 w-44 sm:w-52 h-14 sm:h-16 rounded-t-xl bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 border-x border-t border-rose-200/80 shadow-md flex items-start justify-center overflow-visible">
            {/* Frosting Drips Top */}
            <div className="absolute top-0 inset-x-0 h-4 bg-white/90 rounded-t-xl flex justify-around items-end">
              <span className="w-4 h-3 bg-white/90 rounded-b-full shadow-sm" />
              <span className="w-5 h-4 bg-white/90 rounded-b-full shadow-sm" />
              <span className="w-3 h-2.5 bg-white/90 rounded-b-full shadow-sm" />
              <span className="w-4 h-3.5 bg-white/90 rounded-b-full shadow-sm" />
            </div>
            {/* Strawberries / Berries on Top */}
            <div className="absolute -top-3 inset-x-3 flex justify-between px-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-300 shadow-sm" />
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm" />
            </div>
          </div>

          {/* Tier 2 (Middle Tier) */}
          <div className="relative z-10 w-60 sm:w-72 h-16 sm:h-18 rounded-t-2xl bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 border-x border-t border-rose-300/80 shadow-md flex items-start justify-center">
            {/* Middle Frosting Ribbon */}
            <div className="absolute top-0 inset-x-0 h-4 bg-white/90 flex justify-around items-end">
              <span className="w-6 h-3.5 bg-white/90 rounded-b-full" />
              <span className="w-5 h-4 bg-white/90 rounded-b-full" />
              <span className="w-6 h-3 bg-white/90 rounded-b-full" />
              <span className="w-5 h-4 bg-white/90 rounded-b-full" />
              <span className="w-6 h-3.5 bg-white/90 rounded-b-full" />
            </div>
            {/* Pearl Sprinkles */}
            <div className="w-full flex justify-around mt-7 px-4">
              <span className="w-2 h-2 rounded-full bg-amber-300 shadow-sm" />
              <span className="w-2 h-2 rounded-full bg-pink-400 shadow-sm" />
              <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
              <span className="w-2 h-2 rounded-full bg-amber-300 shadow-sm" />
              <span className="w-2 h-2 rounded-full bg-pink-400 shadow-sm" />
            </div>
          </div>

          {/* Tier 3 (Base Tier) */}
          <div className="relative z-10 w-72 sm:w-88 h-18 sm:h-20 rounded-t-2xl bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200 border border-pink-300 shadow-lg flex items-start justify-center">
            <div className="absolute top-0 inset-x-0 h-4 bg-white/90 flex justify-around items-end">
              <span className="w-7 h-3 bg-white/90 rounded-b-full" />
              <span className="w-6 h-4 bg-white/90 rounded-b-full" />
              <span className="w-8 h-3.5 bg-white/90 rounded-b-full" />
              <span className="w-6 h-4 bg-white/90 rounded-b-full" />
              <span className="w-7 h-3 bg-white/90 rounded-b-full" />
            </div>
            {/* Decorative Gold Stars Accent */}
            <div className="w-full flex justify-around mt-8 px-6 text-amber-400 text-xs">
              <span>✦</span>
              <span>♥</span>
              <span>✦</span>
              <span>♥</span>
              <span>✦</span>
            </div>
          </div>

          {/* Cake Stand / Plate */}
          <div className="relative z-10 w-80 sm:w-96 h-5 rounded-full bg-gradient-to-r from-stone-200 via-white to-stone-200 shadow-xl border-t border-white" />
          <div className="w-32 h-3 bg-stone-300/80 rounded-b-md shadow-sm" />
        </div>

        {/* Action Controls Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          {candlesLit ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleBlowCandles}
              type="button"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-pink-500/25 flex items-center gap-2 hover:shadow-xl transition-all duration-200 min-h-[44px]"
            >
              <Wind className="w-5 h-5 animate-pulse" />
              <span>Blow Out the Candles</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRelight}
              type="button"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center gap-2 hover:shadow-xl transition-all duration-200 min-h-[44px]"
            >
              <Flame className="w-5 h-5 text-yellow-200" />
              <span>Relight Candles</span>
            </motion.button>
          )}

          {/* Make a Wish Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowWishModal(true)}
            type="button"
            className="glass-pill px-6 py-3.5 rounded-full text-stone-700 hover:text-pink-600 font-medium text-sm sm:text-base shadow-sm hover:shadow-md border border-pink-200 flex items-center gap-2 transition-all duration-200 min-h-[44px]"
          >
            <Wand2 className="w-5 h-5 text-pink-500" />
            <span>{wishConfirmed ? '✨ Wish Made!' : 'Make a Wish'}</span>
          </motion.button>
        </div>

        {/* ─── Microphone Blow Detection Controls ─── */}
        <div className="mt-5 flex flex-col items-center gap-3 max-w-md mx-auto w-full">
          {/* Mic Enable / Status Button */}
          {candlesLit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-2 w-full"
            >
              <motion.button
                whileHover={!micBtn.disabled ? { scale: 1.04 } : {}}
                whileTap={!micBtn.disabled ? { scale: 0.96 } : {}}
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else if (!micBtn.disabled) {
                    enableMicrophone();
                  }
                }}
                disabled={micBtn.disabled}
                type="button"
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium
                  flex items-center gap-2 transition-all duration-300
                  min-h-[44px] shadow-sm
                  ${isListening
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 hover:shadow-md'
                    : micStatus === 'denied' || micStatus === 'error'
                      ? 'bg-red-50 text-red-600 border border-red-200 cursor-not-allowed'
                      : micStatus === 'unsupported'
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-violet-500/20 hover:shadow-md cursor-pointer'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {micBtn.icon}
                <span>{micBtn.label}</span>
              </motion.button>

              {/* Listening Indicator & Blow Hint */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    {/* Pulsing indicator */}
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="text-xs text-emerald-700 font-medium">
                        Microphone active
                      </span>
                    </div>

                    {/* Blow hint */}
                    <p className="text-xs sm:text-sm text-stone-500 font-light text-center px-4">
                      Take a breath and blow toward your phone! 💨
                    </p>

                    {/* Blow detected flash */}
                    <AnimatePresence>
                      {blowDetected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200 flex items-center gap-1.5"
                        >
                          <Wind className="w-3.5 h-3.5" />
                          Blow detected!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mic status messages */}
              {micStatus === 'denied' && (
                <p className="text-xs text-red-500 text-center px-4">
                  Microphone access was denied. You can still use the button above to blow out the candles.
                </p>
              )}
              {micStatus === 'unsupported' && (
                <p className="text-xs text-stone-400 text-center px-4">
                  Microphone is not available in this browser. Use the button to blow out the candles.
                </p>
              )}
              {micStatus === 'error' && (
                <p className="text-xs text-red-500 text-center px-4">
                  Something went wrong with the microphone. Try the button instead!
                </p>
              )}

              {/* Idle description */}
              {micStatus === 'idle' && (
                <p className="text-[11px] text-stone-400 text-center px-4 font-light">
                  Enable your microphone to blow out the candles for real! 🎤
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Wish Confirmed Banner */}
        {wishConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-2 rounded-xl bg-pink-100/70 border border-pink-200/80 text-pink-800 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs"
          >
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>Your secret wish is locked in: &quot;{customWish}&quot;</span>
          </motion.div>
        )}

        {/* Post-Blow Birthday Message Card */}
        <AnimatePresence>
          {isBlown && !candlesLit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-10 glass-panel rounded-3xl p-6 sm:p-8 max-w-xl mx-auto text-center border border-pink-200 shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center mx-auto mb-4 shadow-md text-amber-900">
                <Sparkles className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-2">
                Your wish is on its way to the stars! ✨
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                {data.cake.blownSuccessMessage}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-200">
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>Wishes are flying into the universe</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Make a Wish Interactive Modal */}
      <AnimatePresence>
        {showWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-panel bg-white/95 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-pink-600 font-serif font-bold text-lg sm:text-xl">
                  <Wand2 className="w-5 h-5" />
                  <span>Make Your Birthday Wish</span>
                </div>
                <button
                  onClick={() => setShowWishModal(false)}
                  className="text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 min-h-[44px] min-w-[44px]"
                  aria-label="Close wish dialog"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 mb-4 font-light">
                {data.cake.wishPrompt}
              </p>

              {/* Quick Pick Inspiration */}
              <div className="mb-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-2 block">
                  Quick Wish Inspirations:
                </span>
                <div className="flex flex-col gap-1.5">
                  {data.cake.wishes.map((w, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomWish(w)}
                      className="text-left text-xs p-2 rounded-xl bg-pink-50/70 hover:bg-pink-100/80 text-pink-900 border border-pink-100 transition-colors"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Wish Input Form */}
              <form onSubmit={handleSaveWish} className="flex flex-col gap-3">
                <div>
                  <label htmlFor="wishInput" className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-1">
                    Or Type Your Own Secret Wish:
                  </label>
                  <textarea
                    id="wishInput"
                    value={customWish}
                    onChange={(e) => setCustomWish(e.target.value)}
                    placeholder="E.g., Travel to Italy, pass my exam, adopt a puppy..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-stone-800 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowWishModal(false)}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-stone-600 hover:bg-stone-100 min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!customWish.trim()}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs sm:text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all min-h-[44px]"
                  >
                    Seal Wish ✨
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BirthdayCake;
