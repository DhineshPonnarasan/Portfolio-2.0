'use client';

import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
  intensity?: number;
}

const VoiceWaveform = ({ isActive, intensity = 0.5 }: VoiceWaveformProps) => {
  const bars = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-primary rounded-full"
          initial={{ height: 4 }}
          animate={
            isActive
              ? {
                  height: [
                    4,
                    8 + Math.random() * 20 * intensity,
                    4 + Math.random() * 12 * intensity,
                    4,
                  ],
                  opacity: [0.4, 0.8, 0.6, 0.4],
                }
              : { height: 4, opacity: 0.3 }
          }
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: isActive ? Infinity : 0,
            delay: bar * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;

