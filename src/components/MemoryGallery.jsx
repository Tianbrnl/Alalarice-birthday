import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Maximize2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Images,
  Film,
  Play,
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { Lightbox } from './Lightbox';

const PhotoCardMedia = ({ images, title, currentIdx, onPrev, onNext, onDotClick }) => {
  return (
    <>
      <img
        src={images[currentIdx]}
        alt={`${title} - photo ${currentIdx + 1}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Hover overlay hint */}
      <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-white/90 text-stone-800 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <Maximize2 className="w-5 h-5 text-pink-600" />
        </div>
      </div>

      {/* Photo Count Badge (if multiple images) */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 shadow-sm border border-white/20 z-10 pointer-events-none">
          <Images className="w-3 h-3 text-pink-300" />
          <span>
            {currentIdx + 1}/{images.length}
          </span>
        </div>
      )}

      {/* Navigation Arrows (if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-stone-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-stone-700" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-stone-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full border border-white/20">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => onDotClick(e, idx)}
                aria-label={`Go to photo ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIdx
                    ? 'w-4 bg-pink-400'
                    : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

const VideoCardMedia = ({ item }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative w-full h-full bg-stone-900 overflow-hidden flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={item.video}
        preload="metadata"
        muted
        loop
        playsInline
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Video Overlay with Play Button */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/20 group-hover:from-stone-950/40 transition-all duration-300 flex items-center justify-center">
        <div className="w-13 h-13 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-xl backdrop-blur-xs transform group-hover:scale-110 group-hover:bg-pink-600 transition-all duration-300 border-2 border-white/50 pl-0.5">
          <Play className="w-6 h-6 fill-white text-white" />
        </div>
      </div>

      {/* Video Badge */}
      <div className="absolute top-3 right-3 bg-pink-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-sm border border-white/20 z-10 pointer-events-none">
        <Film className="w-3 h-3 text-pink-200" />
        <span>Video Clip</span>
      </div>

      {/* Hover preview indicator */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-full pointer-events-none">
        Tap to watch with sound
      </div>
    </div>
  );
};

const MemoryCard = ({ item, index, onSelect }) => {
  const isVideo = Boolean(item.type === 'video' || item.video);
  const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (e, idx) => {
    e.stopPropagation();
    setCurrentIdx(idx);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onSelect({ ...item, activeIndex: currentIdx })}
      className="cursor-pointer group relative bg-white/90 p-4 sm:p-5 rounded-3xl shadow-lg hover:shadow-2xl border border-pink-100/80 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Media Frame */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 mb-4 shadow-inner">
          {isVideo ? (
            <VideoCardMedia item={item} />
          ) : (
            <PhotoCardMedia
              images={images}
              title={item.title}
              currentIdx={currentIdx}
              onPrev={handlePrev}
              onNext={handleNext}
              onDotClick={handleDotClick}
            />
          )}

          {/* Date Badge */}
          {item.date && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-medium text-stone-700 shadow-sm border border-stone-200/50 z-10 pointer-events-none">
              {item.date}
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-800 group-hover:text-pink-600 transition-colors flex items-center gap-1.5">
              {isVideo && <Clapperboard className="w-4 h-4 text-pink-500 shrink-0" />}
              <span>{item.title}</span>
            </h3>
            <Heart className="w-4 h-4 text-pink-400 group-hover:fill-pink-500 transition-colors shrink-0" />
          </div>
          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 font-light leading-relaxed">
            {item.caption}
          </p>
        </div>
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-pink-50/80 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-pink-600 bg-pink-50/80 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const MemoryGallery = ({ data }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'photos' | 'videos'

  const galleryItems = data.gallery || [];
  const photoCount = galleryItems.filter((i) => i.type !== 'video' && !i.video).length;
  const videoCount = galleryItems.filter((i) => i.type === 'video' || i.video).length;

  const filteredItems = galleryItems.filter((item) => {
    const isVideo = item.type === 'video' || Boolean(item.video);
    if (activeTab === 'photos') return !isVideo;
    if (activeTab === 'videos') return isVideo;
    return true;
  });

  return (
    <section id="memory-gallery" className="relative py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-pink-700">
            <Camera className="w-4 h-4 text-pink-500" />
            <span>Cherished Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-3">
            Our Memory Gallery
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light">
            A treasure trove of smiles, spontaneous adventures, and unforgettable video clips. Click any photo or video to watch and expand.
          </p>
        </div>

        {/* Gallery Filter Tabs (Mobile-first responsive segmented control) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto grid grid-cols-3 gap-1 p-1 sm:p-1.5 bg-stone-200/60 backdrop-blur-md rounded-2xl sm:rounded-full mb-8 sm:mb-12 shadow-inner border border-stone-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl sm:rounded-full text-xs sm:text-sm transition-all duration-300 cursor-pointer select-none ${
              activeTab === 'all'
                ? 'bg-white text-pink-600 shadow-md font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40 font-medium'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="inline sm:hidden">All</span>
            <span className="hidden sm:inline">All Moments</span>
            <span className="text-[10px] sm:text-[11px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold shrink-0">
              {galleryItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl sm:rounded-full text-xs sm:text-sm transition-all duration-300 cursor-pointer select-none ${
              activeTab === 'photos'
                ? 'bg-white text-pink-600 shadow-md font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40 font-medium'
            }`}
          >
            <Images className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span>Photos</span>
            <span className="text-[10px] sm:text-[11px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold shrink-0">
              {photoCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl sm:rounded-full text-xs sm:text-sm transition-all duration-300 cursor-pointer select-none ${
              activeTab === 'videos'
                ? 'bg-white text-pink-600 shadow-md font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40 font-medium'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="inline sm:hidden">Videos</span>
            <span className="hidden sm:inline">Video Clips</span>
            <span className="text-[10px] sm:text-[11px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold shrink-0">
              {videoCount}
            </span>
          </button>
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <MemoryCard
                key={item.id}
                item={item}
                index={index}
                onSelect={setSelectedPhoto}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        key={selectedPhoto?.id}
        item={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </section>
  );
};

export default MemoryGallery;
