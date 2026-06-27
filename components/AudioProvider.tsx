'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setGlobalVolume } from '@/lib/audio/synth';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const MUTE_STORAGE_KEY = 'cyber-audio-muted';

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Guarded localStorage read — never throws in SSR / private-mode.
        try {
            const savedMute = window.localStorage.getItem(MUTE_STORAGE_KEY);
            if (savedMute !== null) {
                setIsMuted(savedMute === 'true');
            } else {
                setIsMuted(false);
            }
        } catch {
            // Ignore unavailable storage (Safari private mode, SSR, etc.)
        }
    }, []);

    useEffect(() => {
        setGlobalVolume(isMuted ? 0 : 0.3);
        try {
            window.localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
        } catch {
            // Ignore quota / unavailability errors.
        }
    }, [isMuted, hasInteracted]);

    const toggleMute = () => setIsMuted(prev => !prev);

    // One-time listener to unlock AudioContext.
    useEffect(() => {
        if (hasInteracted) return;

        const unlock = () => setHasInteracted(true);
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
        };
    }, [hasInteracted]);

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within an AudioProvider');
    return context;
};