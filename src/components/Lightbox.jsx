import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Tag, ChevronLeft, ChevronRight, Images, Film } from 'lucide-react';

export const Lightbox = ({ item, onClose }) => {
  const isVideo = Boolean(item?.type === 'video' || item?.video);
  const images = item && !isVideo ? (item.images && item.images.length > 0 ? item.images : [item.image]) : [];
  const [activeIdx, setActiveIdx] = useState(item?.activeIndex ?? 0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!item) return;

    // Prevent background scrolling while open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape and Arrow key presses
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (!isVideo && e.key === 'ArrowLeft' && images.length > 1) {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (!isVideo && e.key === 'ArrowRight' && images.length > 1) {
        setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose, isVideo, images.length]);

  if (!item) return null;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200/40 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Controls: Badge & Close Button */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
            {isVideo ? (
              <div className="bg-pink-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-md">
                <Film className="w-3.5 h-3.5 text-pink-200" />
                <span>Memory Video Clip</span>
              </div>
            ) : images.length > 1 ? (
              <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/20 shadow-md">
                <Images className="w-3.5 h-3.5 text-pink-300" />
                <span>
                  {activeIdx + 1} / {images.length}
                </span>
              </div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white shadow-md cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Preview: Video Player or Photo Carousel */}
          <div className="relative w-full max-h-[65vh] bg-stone-950 flex items-center justify-center overflow-hidden min-h-[280px] sm:min-h-[420px]">
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  key={item.video}
                  src={item.video}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full max-h-[65vh] object-contain shadow-2xl"
                >
                  Your browser does not support playing this video.
                </video>
              </div>
            ) : (
              <>
                <img
                  key={images[activeIdx]}
                  src={images[activeIdx]}
                  alt={`${item.title} - photo ${activeIdx + 1}`}
                  className="w-full h-full object-contain max-h-[65vh] transition-all duration-300 select-none"
                />

                {/* Lightbox Prev / Next Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous photo"
                      className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next photo"
                      className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Thumbnail Strip (if multiple images) */}
          {!isVideo && images.length > 1 && (
            <div className="px-4 py-2.5 bg-stone-100 border-b border-stone-200/60 flex items-center justify-center gap-2.5 overflow-x-auto">
              {images.map((imgSrc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === activeIdx
                      ? 'border-pink-500 scale-105 shadow-md ring-2 ring-pink-400/40'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                  }`}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <img
                    src={imgSrc}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Caption & Metadata Footer */}
          <div className="p-5 sm:p-7 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 flex items-center gap-2">
                {isVideo && <Film className="w-5 h-5 text-pink-500 inline-block" />}
                <span>{item.title}</span>
              </h3>
              {item.date && (
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              )}
            </div>

            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed mb-4">
              {item.caption}
            </p>

            {item.tags && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md"
                  >
                    <Tag className="w-3 h-3 text-pink-400" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Lightbox;
