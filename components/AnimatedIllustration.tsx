'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedIllustration = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/50 to-zinc-900/30">
            <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background */}
                <rect width="400" height="400" fill="#0a0a0a" />

                {/* Clouds */}
                <motion.g
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Cloud 1 - Top Left */}
                    <ellipse cx="80" cy="60" rx="25" ry="15" fill="#a78bfa" opacity="0.6" />
                    <ellipse cx="100" cy="60" rx="20" ry="12" fill="#a78bfa" opacity="0.6" />
                    <ellipse cx="90" cy="50" rx="18" ry="10" fill="#a78bfa" opacity="0.6" />
                    
                    {/* Cloud 2 - Bottom Left */}
                    <ellipse cx="60" cy="320" rx="20" ry="12" fill="#a78bfa" opacity="0.5" />
                    <ellipse cx="75" cy="320" rx="15" ry="10" fill="#a78bfa" opacity="0.5" />
                    <ellipse cx="68" cy="315" rx="12" ry="8" fill="#a78bfa" opacity="0.5" />
                </motion.g>

                {/* Target */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {/* Target Stand */}
                    <polygon points="50,280 60,280 60,350 50,350" fill="#1e3a8a" />
                    <polygon points="45,280 65,280 60,290 50,290" fill="#1e40af" />
                    
                    {/* Target Circles */}
                    <circle cx="55" cy="280" r="50" fill="none" stroke="#1e3a8a" strokeWidth="3" />
                    <circle cx="55" cy="280" r="35" fill="none" stroke="#1e3a8a" strokeWidth="3" />
                    <circle cx="55" cy="280" r="20" fill="#1e3a8a" stroke="#1e40af" strokeWidth="2" />
                </motion.g>

                {/* Arrow */}
                <motion.g
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    animate={{ 
                        opacity: isVisible ? 1 : 0, 
                        x: isVisible ? 0 : -30,
                        y: isVisible ? 0 : 20
                    }}
                    transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
                >
                    {/* Arrow Shaft */}
                    <line x1="85" y1="270" x2="100" y2="285" stroke="#6b21a8" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Arrow Head */}
                    <polygon points="100,285 110,280 105,285 100,290" fill="#6b21a8" />
                    
                    {/* Arrow Fletching */}
                    <polygon points="85,270 80,265 85,275 90,270" fill="#6b21a8" />
                    <polygon points="85,270 80,275 85,265 90,270" fill="#6b21a8" />
                </motion.g>

                {/* Character */}
                <motion.g
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {/* Head */}
                    <ellipse cx="250" cy="120" rx="18" ry="22" fill="#d1d5db" />
                    {/* Eyes */}
                    <circle cx="245" cy="118" r="2" fill="#000" />
                    <circle cx="255" cy="118" r="2" fill="#000" />
                    {/* Smile */}
                    <path d="M 245 125 Q 250 130 255 125" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    
                    {/* Torso */}
                    <rect x="235" y="140" width="30" height="40" rx="5" fill="#d1d5db" />
                    
                    {/* Left Arm (Raised) */}
                    <motion.rect
                        x="220"
                        y="145"
                        width="15"
                        height="35"
                        rx="7"
                        fill="#6b21a8"
                        animate={{
                            y: [145, 140, 145],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    {/* Left Hand */}
                    <ellipse cx="227" cy="145" rx="6" ry="8" fill="#fbbf24" />
                    
                    {/* Right Arm */}
                    <rect x="265" y="160" width="15" height="30" rx="7" fill="#6b21a8" />
                    {/* Right Hand */}
                    <ellipse cx="272" cy="190" rx="6" ry="8" fill="#fbbf24" />
                    
                    {/* Legs */}
                    <rect x="240" y="180" width="12" height="50" rx="6" fill="#6b21a8" />
                    <rect x="248" y="185" width="12" height="45" rx="6" fill="#6b21a8" />
                    
                    {/* Shoes */}
                    <ellipse cx="246" cy="230" rx="8" ry="5" fill="#6b21a8" />
                    <ellipse cx="254" cy="230" rx="8" ry="5" fill="#6b21a8" />
                    <ellipse cx="246" cy="228" rx="6" ry="3" fill="#8b5cf6" opacity="0.6" />
                    <ellipse cx="254" cy="228" rx="6" ry="3" fill="#8b5cf6" opacity="0.6" />
                </motion.g>

                {/* Bee */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <motion.g
                        animate={{
                            x: [280, 290, 280],
                            y: [100, 95, 100],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Bee Body */}
                        <ellipse cx="285" cy="110" rx="8" ry="5" fill="#fbbf24" />
                        <ellipse cx="280" cy="110" rx="6" ry="4" fill="#000" />
                        <ellipse cx="290" cy="110" rx="6" ry="4" fill="#000" />
                        
                        {/* Bee Wings */}
                        <ellipse cx="282" cy="105" rx="4" ry="6" fill="#fff" opacity="0.8" />
                        <ellipse cx="288" cy="105" rx="4" ry="6" fill="#fff" opacity="0.8" />
                        
                        {/* Bee Antennae */}
                        <line x1="280" y1="105" x2="278" y2="100" stroke="#000" strokeWidth="1" />
                        <line x1="285" y1="105" x2="283" y2="100" stroke="#000" strokeWidth="1" />
                        <circle cx="278" cy="100" r="1" fill="#000" />
                        <circle cx="283" cy="100" r="1" fill="#000" />
                    </motion.g>
                </motion.g>

                {/* Subtle sparkles/stars */}
                {[...Array(15)].map((_, i) => {
                    const x = 50 + (i * 25) % 350;
                    const y = 30 + Math.floor(i / 5) * 100;
                    return (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="#fff"
                            opacity="0.3"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default AnimatedIllustration;

