"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ImagePrompt {
  label: string;
  prompt: string;
}

interface ProjectVisualsProps {
  imagePrompts?: ImagePrompt[];
  projectTitle?: string;
  className?: string;
}

const ProjectVisuals = ({ imagePrompts = [], projectTitle = '', className = '' }: ProjectVisualsProps) => {
  const [displayPrompts, setDisplayPrompts] = useState<ImagePrompt[]>([]);

  useEffect(() => {
    setDisplayPrompts(imagePrompts.slice(0, 5));
  }, [imagePrompts]);

  if (!displayPrompts || displayPrompts.length === 0) {
    return null;
  }

  const fallbackGradients = [
    'from-blue-500 via-purple-500 to-pink-500',
    'from-green-500 via-cyan-500 to-blue-500',
    'from-orange-500 via-red-500 to-purple-500',
    'from-pink-500 via-purple-500 to-blue-500',
    'from-cyan-500 via-blue-500 to-purple-500',
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayPrompts.map((item, idx) => (
          <motion.div
            key={`${item.label}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm shadow-lg hover:border-primary/40 transition-all duration-300"
          >
            {/* Image Placeholder with Gradient */}
            <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  fallbackGradients[idx % fallbackGradients.length]
                } opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="mb-3 text-3xl opacity-50">📊</div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold group-hover:text-primary transition-colors duration-300">
                    {item.label}
                  </p>
                </div>
              </div>

              {/* Animated Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-pulse" />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3 border-t border-primary/10">
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {item.label}
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 group-hover:text-muted-foreground/90 transition-colors duration-300">
                {item.prompt}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
                <span className="text-xs text-primary/60 font-medium">System Output</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {displayPrompts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4 border-t border-primary/10"
        >
          <p className="text-sm text-muted-foreground text-center">
            {displayPrompts.length} visualization concepts
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectVisuals;
