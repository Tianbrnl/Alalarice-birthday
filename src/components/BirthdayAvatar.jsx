import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import avatarAnimation from '../assets/video/bday1.mp4';

/**
 * BirthdayAvatar Component
 * Displays the 2D animated avatar.
 * Removes green screen background from bday1.mp4 in real-time using hardware-accelerated
 * canvas chroma-keying with smooth edge feathering and green despill suppression.
 * Plays once on arrival and cleanly holds the final frame.
 */
export const BirthdayAvatar = ({ name = 'Birthday Girl', className = '' }) => {
  const [isFinished, setIsFinished] = useState(false);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Check if asset is video or image
  const isVideo =
    typeof avatarAnimation === 'string' &&
    (avatarAnimation.endsWith('.webm') ||
      avatarAnimation.endsWith('.mp4') ||
      avatarAnimation.includes('.webm') ||
      avatarAnimation.includes('.mp4'));

  // Ensure video autoplays muted and plays inline on mobile
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.play().catch((err) => {
        console.warn('Autoplay prevented or deferred:', err);
      });
    }
  }, [isVideo]);

  // Real-time canvas chroma-keying to remove green background
  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animCallbackId = null;
    let isCancelled = false;

    const processFrame = () => {
      if (isCancelled || !video || !canvas) return;

      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Optimize canvas resolution for performance and sharpness
        const maxW = 480;
        const scale = Math.min(1, maxW / video.videoWidth);
        const targetW = Math.round(video.videoWidth * scale);
        const targetH = Math.round(video.videoHeight * scale);

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx && targetW > 0 && targetH > 0) {
          ctx.drawImage(video, 0, 0, targetW, targetH);
          try {
            const imgData = ctx.getImageData(0, 0, targetW, targetH);
            const data = imgData.data;
            const len = data.length;

            // Green screen detection thresholds
            // Pure or dark green screen has G significantly greater than max(R, B)
            for (let i = 0; i < len; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const maxRB = Math.max(r, b);
              const diff = g - maxRB;

              // Check if pixel belongs to green background
              if (g > 65 && diff > 15) {
                if (diff > 42) {
                  // Definite green screen background -> 100% transparent
                  data[i + 3] = 0;
                } else {
                  // Anti-aliased feather edge
                  const factor = (diff - 15) / 27;
                  data[i + 3] = Math.round((1 - factor) * 255);
                  // Despill: neutralize green fringe on boundary pixels
                  data[i + 1] = Math.min(g, Math.round(maxRB * 0.95));
                }
              } else if (g > maxRB && maxRB > 25) {
                // Subtle despill on character edges where green screen light reflected
                data[i + 1] = Math.min(g, Math.round(maxRB * 1.05));
              }
            }
            ctx.putImageData(imgData, 0, 0);
          } catch {
            // fallback if canvas security prevents read
          }
        }
      }

      if (!video.paused && !video.ended) {
        if ('requestVideoFrameCallback' in video) {
          animCallbackId = video.requestVideoFrameCallback(processFrame);
        } else {
          animCallbackId = requestAnimationFrame(processFrame);
        }
      }
    };

    const startProcessing = () => {
      if ('requestVideoFrameCallback' in video) {
        animCallbackId = video.requestVideoFrameCallback(processFrame);
      } else {
        animCallbackId = requestAnimationFrame(processFrame);
      }
    };

    video.addEventListener('play', startProcessing);
    video.addEventListener('loadeddata', processFrame);
    video.addEventListener('seeked', processFrame);

    if (!video.paused && video.readyState >= 2) {
      startProcessing();
    }

    return () => {
      isCancelled = true;
      video.removeEventListener('play', startProcessing);
      video.removeEventListener('loadeddata', processFrame);
      video.removeEventListener('seeked', processFrame);
      if ('cancelVideoFrameCallback' in video && animCallbackId) {
        video.cancelVideoFrameCallback(animCallbackId);
      } else if (animCallbackId) {
        cancelAnimationFrame(animCallbackId);
      }
    };
  }, [isVideo]);

  // Handle video playback ended (holds final frame)
  const handleVideoEnded = () => {
    setIsFinished(true);
  };

  // Handle replay
  const handleReplay = (e) => {
    e.stopPropagation();
    setIsFinished(false);

    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div
      className={`relative group flex flex-col items-center justify-center select-none ${className}`}
      aria-label={`${name}'s 2D Birthday Avatar`}
    >
      {/* Avatar Container with aspect ratio preserved, completely transparent without card styling */}
      <div className="relative w-28 xs:w-32 sm:w-36 md:w-40 lg:w-44 max-w-full aspect-[9/16] flex items-center justify-center">
        {isVideo ? (
          <>
            {/* Hidden native video element acting as video stream source */}
            <video
              ref={videoRef}
              src={avatarAnimation}
              autoPlay
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              onEnded={handleVideoEnded}
              onError={(e) => {
                console.error('Avatar video loading error:', e);
                setHasError(true);
              }}
              className="hidden"
            />
            {/* Real-time processed transparent canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
          </>
        ) : (
          <img
            ref={imgRef}
            src={avatarAnimation}
            alt={`${name} waving and celebrating`}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain pointer-events-none"
          />
        )}

        {/* Fallback indicator if asset failed to load */}
        {hasError && (
          <div className="text-xs text-pink-600 p-2 text-center">
            Avatar could not load
          </div>
        )}

        {/* Replay Button overlay when finished */}
        {isFinished && (
          <button
            onClick={handleReplay}
            type="button"
            aria-label="Replay waving animation"
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-stone-700 cursor-pointer"
          >
            <div className="p-2 rounded-full bg-white/90 text-pink-600 shadow-md transform hover:scale-110 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold tracking-wider uppercase mt-1 drop-shadow-sm text-pink-700 bg-white/80 px-2 py-0.5 rounded-full">
              Replay
            </span>
          </button>
        )}

        {/* Playing Sparkle Badge */}
        {!isFinished && !hasError && (
          <div className="absolute top-2 right-2 p-1 rounded-full bg-white/80 backdrop-blur-xs shadow-xs text-amber-500 pointer-events-none">
            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayAvatar;
