import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Coffee, Cake, Heart, Clock } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Compass: Compass,
  Coffee: Coffee,
  Cake: Cake,
  Heart: Heart,
};

export const MemoryTimeline = ({ data }) => {
  return (
    <section id="memory-timeline" className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            <Clock className="w-4 h-4 text-pink-500" />
            <span>Through The Years</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-3">
            Our Journey Together
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light">
            Every step, every laugh, and every quiet chapter that led us right here.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full">
          {/* Vertical Central Line */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-pink-300 via-rose-300 to-purple-300 -translate-x-1/2" />

          {/* Timeline Nodes */}
          <div className="space-y-8 sm:space-y-12">
            {data.timeline.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Sparkles;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } group`}
                >
                  {/* Timeline Node Badge Icon (Left aligned on mobile, centered on desktop) */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 w-11 h-11 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  {/* Content Card */}
                  <div
                    className={`ml-14 sm:ml-0 sm:w-1/2 ${
                      isEven ? 'sm:pr-10' : 'sm:pl-10'
                    }`}
                  >
                    <div className="glass-card bg-white/90 p-5 sm:p-6 rounded-3xl shadow-md hover:shadow-xl border border-pink-100 transition-all duration-300">
                      {/* Year & Date */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold tracking-wider uppercase text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                          {item.year}
                        </span>
                        <span className="text-xs text-stone-600 font-sans">
                          {item.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-800 mb-2">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light mb-3">
                        {item.description}
                      </p>

                      {/* Highlight quote/tag */}
                      {item.highlight && (
                        <div className="pt-2 border-t border-pink-50 text-[11px] sm:text-xs font-medium text-pink-700 italic flex items-center gap-1.5">
                          <span>♥</span>
                          <span>{item.highlight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoryTimeline;
