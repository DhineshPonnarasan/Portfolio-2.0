'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface AnimatedMicIconProps {
  isListening: boolean;
  size?: number;
}

const AnimatedMicIcon = ({ isListening, size = 16 }: AnimatedMicIconProps) => {
  return (
    <div className="relative">
      <motion.div
        animate={
          isListening
            ? {
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{
          duration: 1.5,
          repeat: isListening ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <Mic size={size} />
      </motion.div>
      
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/30"
            animate={{
              scale: [1, 2, 2.5],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20"
            animate={{
              scale: [1, 1.8, 2.2],
              opacity: [0.4, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
              ease: 'easeOut',
            }}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedMicIcon;

