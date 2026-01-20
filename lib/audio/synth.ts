/**
 * Cyberpunk Audio Synthesizer
 * Generates sci-fi UI sounds procedurally using Web Audio API.
 * Background music uses HTML5 Audio with custom file.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const initAudio = () => {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        // @ts-ignore
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.3; // Default volume
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

/* --- SFX IMPORTS --- */

export const playHoverSound = () => {
    const ctx = initAudio();
    if (!ctx || !masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
};

export const playClickSound = () => {
    const ctx = initAudio();
    if (!ctx || !masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.11);
};

export const playConfirmSound = () => {
    const ctx = initAudio();
    if (!ctx || !masterGain) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc2.frequency.setValueAtTime(554.37, ctx.currentTime); // C#5

    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
    osc2.frequency.exponentialRampToValueAtTime(1108.73, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGain);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.31);
    osc2.stop(ctx.currentTime + 0.31);
};

/* --- AMBIENCE GENERATOR (HTML5 Audio) --- */

let audioElement: HTMLAudioElement | null = null;

export const startAmbience = () => {
    if (audioElement && !audioElement.paused) return; // Already playing

    if (typeof window === 'undefined') return;

    // Create audio element if it doesn't exist
    if (!audioElement) {
        audioElement = new Audio('/audio/background.mp3');
        audioElement.loop = true; // Enable looping
        audioElement.volume = 0.3; // Set volume

        // Add time update listener to enforce 60-second limit
        audioElement.addEventListener('timeupdate', () => {
            if (audioElement && audioElement.currentTime >= 60) {
                audioElement.currentTime = 0; // Reset to beginning after 60s
            }
        });
    }

    // Play the audio
    audioElement.play().catch(err => {
        console.warn('Audio playback failed:', err);
    });
};

export const stopAmbience = () => {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0; // Reset to beginning
    }
};


export const setGlobalVolume = (vol: number) => {
    if (masterGain) {
        masterGain.gain.setTargetAtTime(vol, audioCtx?.currentTime || 0, 0.1);
    }

    // Also update audio element volume
    if (audioElement) {
        audioElement.volume = vol;
    }
};
