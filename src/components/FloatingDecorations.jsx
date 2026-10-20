import React from 'react';
import { motion } from 'motion/react';

export const FloatingDecorations = () => {
  // Pre-configured decorative balloons with pastel colors
  const balloons = [
    { id: 1, color: 'from-pink-300 to-rose-400', left: '6%', delay: 0, duration: 9, size: 'w-10 h-14 md:w-14 md:h-18' },
    { id: 2, color: 'from-purple-300 to-indigo-300', left: '18%', delay: 3, duration: 11, size: 'w-12 h-16 md:w-16 md:h-20' },
    { id: 3, color: 'from-amber-200 to-yellow-300', left: '82%', delay: 1.5, duration: 10, size: 'w-11 h-15 md:w-14 md:h-18' },
    { id: 4, color: 'from-rose-200 to-pink-300', left: '92%', delay: 4, duration: 12, size: 'w-9 h-13 md:w-12 md:h-16' },
  ];

  // Subtle twinkling stars
  const stars = [
    { id: 1, top: '15%', left: '10%', size: 16, delay: 0 },
    { id: 2, top: '28%', left: '88%', size: 20, delay: 1.2 },
    { id: 3, top: '55%', left: '5%', size: 14, delay: 0.6 },
    { id: 4, top: '70%', left: '94%', size: 18, delay: 2.1 },
    { id: 5, top: '40%', left: '50%', size: 12, delay: 1.8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Soft Ambient Glow Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl opacity-70 animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-purple-200/35 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-amber-100/40 rounded-full blur-3xl opacity-60" />

      {/* Floating Balloons */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bottom-[-100px] flex flex-col items-center"
          style={{ left: b.left }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-130vh',
            opacity: [0, 0.85, 0.85, 0],
            x: [0, (b.id % 2 === 0 ? 18 : -18), 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: 'linear',
          }}
        >
          {/* Balloon Oval */}
          <div
            className={`${b.size} rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] bg-gradient-to-tr ${b.color} shadow-lg relative opacity-90`}
          >
            {/* Balloon Gloss Highlight */}
            <div className="absolute top-2 left-2.5 w-2 h-4 rounded-full bg-white/60 blur-[0.5px] rotate-[-20deg]" />
            {/* Knot */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-rose-400/80 rounded-sm" />
          </div>
          {/* String */}
          <div className="w-[1px] h-14 bg-stone-300/60" />
        </motion.div>
      ))}

      {/* Twinkling Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute animate-twinkle text-amber-300/70"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: `${s.delay}s`,
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
export default FloatingDecorations;
