import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, RotateCcw, Ticket, Copy, Check } from 'lucide-react';
import { fireCelebrationConfetti, fireStarBurst } from '../utils/confettiHelper';

export const GiftBox = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenGift = () => {
    if (!isOpen) {
      setIsOpen(true);
      fireCelebrationConfetti();
      fireStarBurst();
    }
  };

  const handleResetGift = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (data.gift.voucherCode) {
      navigator.clipboard.writeText(data.gift.voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="gift-box" className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            <Gift className="w-4 h-4 text-pink-500" />
            <span>{data.gift.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-3">
            {data.gift.heading}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light">
            {data.gift.subtitle}
          </p>
        </div>

        {/* Gift Box Container */}
        <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Closed or Opening Present */}
          <div
            onClick={!isOpen ? handleOpenGift : undefined}
            className={`relative flex flex-col items-center justify-center p-4 select-none ${
              !isOpen ? 'cursor-pointer group' : ''
            }`}
          >
            {/* Gentle float animation when closed */}
            <motion.div
              animate={!isOpen ? { y: [0, -8, 0] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative flex flex-col items-center"
            >
              {/* Ribbon Bow on Top */}
              <motion.div
                animate={
                  isOpen
                    ? { y: -80, rotate: -20, opacity: 0.2 }
                    : { y: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-30 mb-[-10px] flex items-center justify-center"
              >
                {/* Bow Left Loop */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-amber-300 bg-amber-400 shadow-md rotate-[-30deg] -mr-2" />
                {/* Bow Center Knot */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-300 shadow-lg z-10 border border-amber-200" />
                {/* Bow Right Loop */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-amber-300 bg-amber-400 shadow-md rotate-[30deg] -ml-2" />
              </motion.div>

              {/* Gift Box Lid */}
              <motion.div
                animate={
                  isOpen
                    ? { y: -60, x: -20, rotate: -18, opacity: 0 }
                    : { y: 0, x: 0, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-20 w-52 sm:w-64 h-12 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 shadow-lg border border-pink-400 flex items-center justify-center"
              >
                {/* Gold Vertical Ribbon on Lid */}
                <div className="w-8 h-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 shadow-xs" />
              </motion.div>

              {/* Gift Box Base */}
              <div className="relative z-10 -mt-2 w-48 sm:w-60 h-44 sm:h-52 rounded-b-2xl bg-gradient-to-b from-rose-500 via-pink-600 to-rose-600 shadow-2xl border-x border-b border-rose-400 flex flex-col items-center justify-between overflow-hidden">
                {/* Vertical Ribbon */}
                <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 shadow-xs z-10" />
                {/* Horizontal Ribbon */}
                <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-300 shadow-xs z-10" />

                {/* Sparkling Hint when Closed */}
                {!isOpen && (
                  <div className="relative z-20 my-auto text-white flex flex-col items-center gap-1.5 px-4 text-center">
                    <Sparkles className="w-6 h-6 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md">
                      {data.gift.closedPrompt}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Revealed Surprise Voucher Card */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                className="w-full mt-8"
              >
                <div className="glass-panel bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 relative overflow-hidden text-center">
                  {/* Decorative golden badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-4 border border-amber-200">
                    <Ticket className="w-4 h-4 text-amber-600" />
                    <span>Special Birthday Privilege</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 mb-3">
                    {data.gift.revealTitle}
                  </h3>

                  {/* Message */}
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-light max-w-lg mx-auto">
                    {data.gift.revealMessage}
                  </p>

                  {/* Voucher Code Box */}
                  {data.gift.voucherCode && (
                    <div className="inline-flex items-center gap-3 bg-pink-50 border border-pink-200 px-4 py-2.5 rounded-2xl mb-6 shadow-inner">
                      <span className="text-xs uppercase tracking-wider font-semibold text-pink-600">
                        Pass Code:
                      </span>
                      <code className="font-mono font-bold text-sm sm:text-base text-stone-800">
                        {data.gift.voucherCode}
                      </code>
                      <button
                        onClick={handleCopyCode}
                        type="button"
                        className="p-1.5 rounded-lg text-pink-600 hover:bg-pink-100 transition-colors"
                        title="Copy code"
                        aria-label="Copy code"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {/* Replay Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleResetGift}
                      type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-medium transition-all shadow-sm min-h-[44px]"
                    >
                      <RotateCcw className="w-4 h-4 text-stone-500" />
                      <span>{data.gift.replayText}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default GiftBox;
