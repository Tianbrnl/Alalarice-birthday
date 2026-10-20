/**
 * Gentle Music Box Synthesizer using Web Audio API
 * Plays a delicate, dreamy music box rendition of Happy Birthday
 */
class BirthdayMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  // Frequency mapping for notes
  getNoteFreq(note) {
    const notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50
    };
    return notes[note] || 440;
  }

  // Play a soft chime bell/music box note
  playChime(note, time, duration = 1.2) {
    if (!this.ctx) return;
    const freq = this.getNoteFreq(note);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Use sine + small harmonic for music box warmth
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Sweet bell decay envelope
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.25, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // The melody: [note, duration in seconds]
  getMelody() {
    return [
      ['G4', 0.4], ['G4', 0.4], ['A4', 0.8], ['G4', 0.8], ['C5', 0.8], ['B4', 1.4],
      ['G4', 0.4], ['G4', 0.4], ['A4', 0.8], ['G4', 0.8], ['D5', 0.8], ['C5', 1.4],
      ['G4', 0.4], ['G4', 0.4], ['G5', 0.8], ['E5', 0.8], ['C5', 0.8], ['B4', 0.8], ['A4', 1.2],
      ['F5', 0.4], ['F5', 0.4], ['E5', 0.8], ['C5', 0.8], ['D5', 0.8], ['C5', 1.8]
    ];
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;

    const melody = this.getMelody();
    let currentStep = 0;

    const playLoop = () => {
      if (!this.isPlaying || !this.ctx) return;
      const [note, dur] = melody[currentStep];
      this.playChime(note, this.ctx.currentTime, Math.max(dur * 1.5, 0.8));

      currentStep = (currentStep + 1) % melody.length;
      const pauseBetweenLoops = currentStep === 0 ? 1800 : 0;
      this.timer = setTimeout(playLoop, dur * 600 + pauseBetweenLoops);
    };

    playLoop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const musicBox = new BirthdayMusicBox();
