import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Lock, Unlock, Feather } from 'lucide-react';
import { fireStarBurst } from '../utils/confettiHelper';

export const BirthdayLetter = ({ data }) => {
  const [showSecret, setShowSecret] = useState(false);

  const handleToggleSecret = () => {
    if (!showSecret) {
      fireStarBurst();
    }
    setShowSecret(!showSecret);
  };

  return (
    <section id="birthday-letter" className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Section Badge */}
        <div className="text-center mb-8">
          <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            <Feather className="w-4 h-4 text-pink-500" />
            <span>{data.letter.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-2">
            {data.letter.heading}
          </h2>
        </div>

        {/* Elegant Letter Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="w-full glass-card bg-amber-50/50 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border border-rose-100 relative overflow-hidden"
        >
          {/* Subtle Decorative Stamp / Wax Seal */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex flex-col items-center opacity-85 pointer-events-none">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md border-2 border-rose-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-500 mt-1 font-sans">
              With Love
            </span>
          </div>

          {/* Salutation */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 italic">
              {data.letter.salutation}
            </h3>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-4 sm:space-y-5 text-stone-700 text-base sm:text-lg leading-relaxed font-light">
            {data.letter.paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 + 0.2, duration: 0.6 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Signoff */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 pt-4 border-t border-rose-200/50 flex flex-col items-start"
          >
            <p className="text-sm sm:text-base text-stone-500 italic">
              {data.letter.signoff}
            </p>
            <p className="text-xl sm:text-2xl font-serif font-bold text-pink-600 mt-1">
              {data.senderName}
            </p>
          </motion.div>

          {/* Interactive Button for Secret Message */}
          <div className="mt-10 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleToggleSecret}
              type="button"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-pink-500/20 hover:shadow-xl transition-all flex items-center gap-2.5 min-h-[44px]"
            >
              {showSecret ? (
                <>
                  <Unlock className="w-5 h-5 text-yellow-200" />
                  <span>Hide Special Message</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-pink-200" />
                  <span>Read My Special Message</span>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </>
              )}
            </motion.button>

            {/* Revealed Secret Message */}
            <AnimatePresence>
              {showSecret && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full mt-6 overflow-hidden"
                >
                  <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-rose-100/90 via-pink-100/90 to-purple-100/90 border-2 border-pink-300 shadow-md relative text-stone-800">
                    <div className="flex items-center gap-2 mb-2 text-pink-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Hidden Birthday Note</span>
                    </div>
                    <p className="text-base sm:text-lg font-serif italic leading-relaxed text-stone-800">
                      {data.letter.secretMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BirthdayLetter;
