'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { VolumeX, Music, Play, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logAiError } from '@/lib/groq';
import { useReducedMotion } from '@/lib/motion-prefs';

const SONG_NAME = 'Naan Un';
const AUDIO_SRC = '/Naan Un.mpeg';
// Use encodeURI to ensure spaces are handled correctly in all browsers
const SAFE_AUDIO_SRC = encodeURI(AUDIO_SRC);
const MAX_DURATION = 60; // 60 seconds limit

const MusicPlayer = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timeUpdateRef = useRef<(() => void) | null>(null);
    const reducedMotion = useReducedMotion();

    // Lazily create the audio element on first play (not on mount).
    // This avoids loading the 6.9MB asset for users who never click play.
    const ensureAudio = () => {
        if (audioRef.current) return audioRef.current;
        const audio = new Audio(SAFE_AUDIO_SRC);
        audio.loop = true;
        audio.volume = 0.3;
        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            setCurrentTime(time);
            // Reset at 60 seconds
            if (time >= MAX_DURATION) {
                audio.currentTime = 0;
            }
        };
        audio.addEventListener('timeupdate', handleTimeUpdate);
        timeUpdateRef.current = handleTimeUpdate;
        audioRef.current = audio;
        return audio;
    };

    // Cleanup on unmount.
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                if (timeUpdateRef.current) {
                    audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
                }
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        const audio = ensureAudio();
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch((err) => {
                logAiError('music', 'play_failed');
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('Audio playback failed:', err);
                }
            });
        }
        setIsPlaying(!isPlaying);
    };

    const skipToStart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
        }
    };

    const progress = (currentTime / MAX_DURATION) * 100;

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button
                className="size-10 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-sm border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all z-[2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={isPlaying ? 'Music playing — click to pause' : 'Music paused — click to play'}
                aria-pressed={isPlaying}
                onClick={togglePlay}
            >
                {isPlaying ? (
                    <Music className={`size-5 text-primary ${reducedMotion ? '' : 'animate-pulse'}`} />
                ) : (
                    <VolumeX className="size-5" />
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={reducedMotion ? false : { opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 z-50 w-64"
                    >
                        {/* Cyberpunk Container */}
                        <div className="relative bg-black/95 border border-primary/50 rounded-lg p-5 backdrop-blur-md shadow-2xl shadow-primary/20">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                            {/* Header */}
                            <div className="flex items-center gap-2 mb-4 text-xs text-primary font-mono uppercase tracking-wider opacity-80">
                                <Music className="size-3" />
                                <span>Now Playing</span>
                            </div>

                            {/* Song Info */}
                            <div className="mb-6">
                                <h3 className="text-white font-bold text-base truncate tracking-wide">{SONG_NAME}</h3>
                                <p className="text-white/40 text-xs font-medium uppercase tracking-widest mt-0.5">Instrumental</p>
                            </div>

                            {/* Progress Bar (Full Visual) */}
                            <div className="mb-6 group">
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden ring-1 ring-white/10 group-hover:ring-primary/30 transition-all duration-300">
                                    <motion.div
                                        className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                        style={{ width: `${progress}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                            </div>

                            {/* Controls - Clean & Centered */}
                            <div className="flex items-center justify-center gap-6">
                                {/* Previous (Restart) */}
                                <button
                                    onClick={skipToStart}
                                    className="p-2 rounded-full text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300"
                                    aria-label="Restart"
                                >
                                    <SkipForward className="size-5 rotate-180 opacity-70 hover:opacity-100" />
                                </button>

                                {/* Play/Pause (Hero Button) */}
                                <button
                                    onClick={togglePlay}
                                    className="p-3.5 rounded-full bg-primary text-black hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300"
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? (
                                        <Pause className="size-6 fill-current" />
                                    ) : (
                                        <Play className="size-6 ml-1 fill-current" />
                                    )}
                                </button>

                                {/* Next (Skip) */}
                                <button
                                    onClick={skipToStart}
                                    className="p-2 rounded-full text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300"
                                    aria-label="Skip"
                                >
                                    <SkipForward className="size-5 opacity-70 hover:opacity-100" />
                                </button>
                            </div>

                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 rounded-tl" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50 rounded-br" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default MusicPlayer;
MusicPlayer.displayName = 'MusicPlayer';
