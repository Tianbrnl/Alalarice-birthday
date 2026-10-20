import confetti from 'canvas-confetti';

/**
 * Fires a joyful celebratory confetti shower with customized pastel & gold colors
 */
export const fireCelebrationConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#f472b6', '#ec4899', '#c084fc', '#a855f7', '#fbbf24', '#fde047', '#fed7aa', '#fbcfe8']
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

/**
 * Dual cannon burst from bottom corners
 */
export const fireSideCannons = () => {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#f472b6', '#ec4899', '#e879f9', '#fcd34d', '#fed7aa'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.85 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.85 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

/**
 * Star & heart burst for wishes and gifts
 */
export const fireStarBurst = () => {
  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0.4,
    decay: 0.94,
    startVelocity: 20,
    colors: ['#FFE4E6', '#F472B6', '#FDE047', '#C084FC', '#FFFFFF']
  };

  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ['star']
  });

  confetti({
    ...defaults,
    particleCount: 25,
    scalar: 0.75,
    shapes: ['circle']
  });
};
