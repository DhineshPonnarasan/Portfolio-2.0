'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SONG_NAME = 'Naan Un';
const AUDIO_SRC = '/Naan Un.mpeg';
const MAX_DURATION = 60; // 60 seconds limit

const MusicPlayer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio(AUDIO_SRC);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;

        // Time update handler for 60-second limit
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                const time = audioRef.current.currentTime;
                setCurrentTime(time);

                // Reset at 60 seconds
                if (time >= MAX_DURATION) {
                    audioRef.current.currentTime = 0;
                }
            }
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(console.warn);
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
                className="size-10 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-sm border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all z-[2]"
                aria-label={isPlaying ? 'Music playing' : 'Music paused'}
                onClick={togglePlay}
            >
                {isPlaying ? (
                    <Music className="size-5 animate-pulse text-primary" />
                ) : (
                    <VolumeX className="size-5" />
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
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
};

export default MusicPlayer;
