'use client';

import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface SpeakingAnimationProps {
  isSpeaking: boolean;
}

const SpeakingAnimation = ({ isSpeaking }: SpeakingAnimationProps) => {
  const soundWaves = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={isSpeaking ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{
          duration: 0.8,
          repeat: isSpeaking ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <Volume2 size={18} className="text-green-400" />
      </motion.div>
      
      {isSpeaking && (
        <div className="flex items-center gap-1">
          {soundWaves.map((wave) => (
            <motion.div
              key={wave}
              className="w-1 bg-green-400 rounded-full"
              animate={{
                height: [4, 12, 4],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: wave * 0.2,
                ease: 'easeInOut',
              }}
              style={{ height: 8 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeakingAnimation;

