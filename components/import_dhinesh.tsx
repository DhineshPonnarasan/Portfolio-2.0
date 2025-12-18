'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import QuotePopup from './QuotePopup';

interface QuoteData {
  text: string;
  author: string;
}

const TECH_QUOTES: QuoteData[] = [
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { text: 'The function of good software is to make the complex appear to be simple.', author: 'Grady Booch' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Simple things should be simple, complex things should be possible.', author: 'Alan Kay' },
  { text: 'Clean code always looks like it was written by someone who cares.', author: 'Robert C. Martin' },
  { text: 'Without requirements or design, programming is the art of adding bugs to an empty text file.', author: 'Louis Srygley' },
];

const AUTO_DISMISS_MS = 8500;

export default function ImportDhinesh() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cycle, setCycle] = useState(0);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const scheduleDismiss = useCallback(() => {
    clearTimer();
    dismissTimerRef.current = setTimeout(() => setIsOpen(false), AUTO_DISMISS_MS);
  }, [clearTimer]);

  const getRandomQuote = useCallback(() => {
    return TECH_QUOTES[Math.floor(Math.random() * TECH_QUOTES.length)];
  }, []);

  const handleTrigger = () => {
    const nextQuote = getRandomQuote();
    setQuote(nextQuote);
    setIsOpen(true);
    setCycle((prev) => prev + 1);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (isOpen) {
      scheduleDismiss();
    }
    return () => clearTimer();
  }, [isOpen, scheduleDismiss, clearTimer]);

  return (
    <div className="absolute left-4 top-6 sm:left-8 sm:top-8 z-30">
      <div className="relative flex flex-col items-start gap-2">
        <motion.button
          onClick={handleTrigger}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group/button relative w-full overflow-hidden rounded-2xl bg-black/50 px-6 py-4 text-left font-mono tracking-wide shadow-[0_15px_45px_rgba(0,0,0,0.45)] backdrop-blur-lg transition"
        >
          <div className="absolute -inset-2 rounded-[26px] bg-primary/20 blur-2xl opacity-0 transition duration-500 group-hover/button:opacity-80" />
          <div className="absolute inset-0 rounded-[22px] border border-primary/20 opacity-0 transition duration-500 group-hover/button:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition duration-[1200ms] group-hover/button:opacity-100" />

          <div className="relative flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] animate-pulse" />
            <span className="text-2xl font-black text-white">
              ~/import_dhinesh
            </span>
          </div>
        </motion.button>

        <QuotePopup
          isOpen={isOpen}
          quote={quote}
          onClose={handleClose}
          animationKey={cycle}
          duration={AUTO_DISMISS_MS}
        />
      </div>
    </div>
  );
}
