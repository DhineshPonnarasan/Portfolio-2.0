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
                        <div className="relative bg-black/95 border border-primary/50 rounded-lg p-4 backdrop-blur-md shadow-2xl shadow-primary/20">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3 text-xs text-primary font-mono uppercase tracking-wider">
                                <Music className="size-3" />
                                <span>Now Playing</span>
                            </div>

                            {/* Song Info */}
                            <div className="mb-4">
                                <h3 className="text-white font-semibold text-sm truncate">{SONG_NAME}</h3>
                                <p className="text-muted-foreground text-xs">Instrumental</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${progress}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
                                    <span>{Math.floor(currentTime)}s</span>
                                    <span>{MAX_DURATION}s</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={skipToStart}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
                                    aria-label="Restart"
                                >
                                    <SkipForward className="size-4 rotate-180" />
                                </button>

                                <button
                                    onClick={togglePlay}
                                    className="p-3 rounded-full bg-primary text-black hover:bg-primary/80 transition-all"
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? (
                                        <Pause className="size-5" />
                                    ) : (
                                        <Play className="size-5 ml-0.5" />
                                    )}
                                </button>

                                <button
                                    onClick={skipToStart}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
                                    aria-label="Skip"
                                >
                                    <SkipForward className="size-4" />
                                </button>
                            </div>

                            {/* 60s Loop Indicator */}
                            <div className="mt-3 text-center">
                                <span className="text-xs text-primary/60 font-mono">🔁 60s Loop</span>
                            </div>

                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-lg" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MusicPlayer;
