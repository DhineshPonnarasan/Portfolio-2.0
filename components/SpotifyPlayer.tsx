'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLAYLIST_ID = '3nSQLdYPSLwejsWj4WMbeg';

const SpotifyPlayer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button
                className="p-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={isMuted ? 'Open music player' : 'Music playing'}
                onClick={() => setIsMuted(!isMuted)}
            >
                {isMuted ? (
                    <VolumeX className="size-5" />
                ) : (
                    <Music className="size-5 animate-pulse" />
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
                        className="absolute right-0 top-full mt-2 z-50"
                    >
                        {/* Cyberpunk Container */}
                        <div className="relative bg-black/90 border border-primary/50 rounded-lg p-3 backdrop-blur-md shadow-2xl shadow-primary/20">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                            {/* Header */}
                            <div className="flex items-center gap-2 mb-2 text-xs text-primary font-mono uppercase tracking-wider">
                                <Music className="size-3" />
                                <span>Now Playing</span>
                            </div>

                            {/* Spotify Embed */}
                            <iframe
                                src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
                                width="300"
                                height="152"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="rounded-md"
                                style={{ minHeight: '152px' }}
                            />

                            {/* Decorative Corner */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-lg" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SpotifyPlayer;
