import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, MessageCircleHeart } from 'lucide-react';

export const SpecialMessage = ({ data }) => {
  const messageData = data.specialMessage;
  if (!messageData) return null;

  return (
    <section id="special-message" className="relative py-14 sm:py-20 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            <MessageCircleHeart className="w-4 h-4 text-pink-500" />
            <span>{messageData.badge || 'A Special Message'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-2">
            {messageData.heading || 'Just For You, Alalarice'}
          </h2>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="w-full glass-card bg-white/95 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-pink-100/90 relative overflow-hidden"
        >
          {/* Decorative Corner Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* Salutation */}
          {messageData.salutation && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-pink-600">
                {messageData.salutation}
              </h3>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-4 sm:space-y-5 text-stone-700 text-base sm:text-lg leading-relaxed font-light font-sans whitespace-pre-line">
            {Array.isArray(messageData.paragraphs) ? (
              messageData.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'text-xl sm:text-2xl font-serif font-bold text-pink-600 pb-1'
                      : 'leading-relaxed'
                  }
                >
                  {p}
                </p>
              ))
            ) : (
              <p className="leading-relaxed">{messageData.content || messageData.text}</p>
            )}
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-stone-500 italic">
                {messageData.signoff || 'Always here for you,'}
              </p>
              <p className="text-lg sm:text-xl font-serif font-bold text-pink-600">
                {data.senderName || 'Enryu'}
              </p>
            </div>


          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialMessage;
