'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setGlobalVolume, startAmbience, stopAmbience } from '@/lib/audio/synth';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const savedMute = localStorage.getItem('cyber-audio-muted');
        if (savedMute !== null) {
            setIsMuted(savedMute === 'true');
        } else {
            setIsMuted(false);
        }
    }, []);

    useEffect(() => {
        setGlobalVolume(isMuted ? 0 : 0.3);

        // Handle Ambience (Background Drone)
        if (!isMuted && hasInteracted) {
            startAmbience();
        } else {
            stopAmbience();
        }

        localStorage.setItem('cyber-audio-muted', String(isMuted));
    }, [isMuted, hasInteracted]);

    const toggleMute = () => setIsMuted(prev => !prev);

    // One-time listener to unlock AudioContext
    useEffect(() => {
        const unlock = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
            }
        };
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
