import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useBlowDetection – Custom hook for approximate blow detection via the microphone.
 *
 * Uses Web Audio API AnalyserNode to monitor audio energy.  When sustained energy
 * exceeds a calibrated threshold for a configurable duration, the onBlow callback fires.
 *
 * Limitations acknowledged: this cannot reliably distinguish blowing from speech,
 * clapping, or other loud sounds.  It is an *approximate* blow detector.
 *
 * @param {Object}   options
 * @param {Function} options.onBlow          – Callback when a blow-like sound is detected
 * @param {number}   [options.threshold=1.6] – Multiplier above ambient noise to count as a blow
 * @param {number}   [options.duration=400]  – Milliseconds the signal must stay above threshold
 * @param {number}   [options.cooldown=2000] – Cooldown (ms) after a blow before re-detection
 * @param {number}   [options.fftSize=256]   – FFT size for the AnalyserNode
 */
export function useBlowDetection({
  onBlow,
  threshold = 1.6,
  duration = 400,
  cooldown = 2000,
  fftSize = 256,
} = {}) {
  const [micStatus, setMicStatus] = useState('idle');
  // 'idle' | 'requesting' | 'calibrating' | 'listening' | 'denied' | 'unsupported' | 'error'

  const [isListening, setIsListening] = useState(false);
  const [blowDetected, setBlowDetected] = useState(false);

  // Refs for audio pipeline
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafIdRef = useRef(null);

  // Detection state refs
  const ambientRef = useRef(0);
  const aboveStartRef = useRef(null);   // timestamp when energy first exceeded threshold
  const lastBlowRef = useRef(0);        // timestamp of last successful blow detection
  const onBlowRef = useRef(onBlow);

  // Keep callback ref fresh
  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  /**
   * Compute the RMS (root-mean-square) energy from time-domain data.
   */
  const computeRMS = useCallback((dataArray) => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] - 128) / 128; // normalise from [0,255] → [-1,1]
      sum += v * v;
    }
    return Math.sqrt(sum / dataArray.length);
  }, []);

  /**
   * Calibrate ambient noise for ~800ms, then begin detection.
   */
  const calibrate = useCallback((analyser) => {
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    const samples = [];
    const calStart = performance.now();
    const CAL_DURATION = 800; // ms

    const sampleAmbient = () => {
      if (performance.now() - calStart > CAL_DURATION) {
        // Set ambient as average of collected RMS samples
        const avg = samples.length > 0
          ? samples.reduce((a, b) => a + b, 0) / samples.length
          : 0.02; // sensible floor
        ambientRef.current = Math.max(avg, 0.01); // never zero
        setMicStatus('listening');
        setIsListening(true);
        return;
      }
      analyser.getByteTimeDomainData(dataArray);
      samples.push(computeRMS(dataArray));
      rafIdRef.current = requestAnimationFrame(sampleAmbient);
    };

    rafIdRef.current = requestAnimationFrame(sampleAmbient);
  }, [computeRMS]);

  /**
   * The main detection loop.
   */
  const detect = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const loop = () => {
      analyser.getByteTimeDomainData(dataArray);
      const rms = computeRMS(dataArray);
      const now = performance.now();

      const blowThreshold = ambientRef.current * threshold;

      if (rms > blowThreshold) {
        if (aboveStartRef.current === null) {
          aboveStartRef.current = now;
        } else if (
          now - aboveStartRef.current >= duration &&
          now - lastBlowRef.current >= cooldown
        ) {
          // Blow detected!
          lastBlowRef.current = now;
          aboveStartRef.current = null;
          setBlowDetected(true);

          if (onBlowRef.current) {
            onBlowRef.current();
          }

          // Reset blowDetected flag after a short visual period
          setTimeout(() => setBlowDetected(false), 1200);
        }
      } else {
        aboveStartRef.current = null;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
  }, [computeRMS, threshold, duration, cooldown]);

  /**
   * Request microphone access and start the audio pipeline.
   */
  const enableMicrophone = useCallback(async () => {
    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicStatus('unsupported');
      return;
    }

    // Check for secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      setMicStatus('unsupported');
      return;
    }

    setMicStatus('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      // Create AudioContext
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      // Resume context if it was suspended (Chrome autoplay policy)
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      // Build audio graph
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Calibrate, then auto-start detection
      setMicStatus('calibrating');
      calibrate(analyser);

      // After calibration completes (~800ms), start detection
      setTimeout(() => {
        detect();
      }, 900);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicStatus('denied');
      } else {
        console.error('Microphone access error:', err);
        setMicStatus('error');
      }
    }
  }, [fftSize, calibrate, detect]);

  /**
   * Stop detection, clean up all resources.
   */
  const stopListening = useCallback(() => {
    // Cancel animation frame loop
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Stop microphone tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    analyserRef.current = null;
    aboveStartRef.current = null;

    setIsListening(false);
    setBlowDetected(false);
    setMicStatus('idle');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    micStatus,
    isListening,
    blowDetected,
    enableMicrophone,
    stopListening,
  };
}

export default useBlowDetection;
