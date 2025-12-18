"use client";

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { motion } from 'framer-motion';

interface SystemDiagramProps {
  diagram: string;
  title: string;
  className?: string;
}

const SystemDiagram = ({ diagram, title, className = "" }: SystemDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !diagram) return;

    const renderDiagram = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          securityLevel: 'loose',
          flowchart: {
            curve: 'linear',
            useMaxWidth: true,
            htmlLabels: true,
            padding: 20,
          },
          fontFamily: 'system-ui, -apple-system, sans-serif',
        });

        // Clear previous content
        container.innerHTML = `<div class="mermaid">${diagram}</div>`;

        // Render the diagram
        await mermaid.contentLoaded();
      } catch (error) {
        console.error('Mermaid diagram render error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-destructive p-4">Failed to render diagram</div>`;
        }
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
        <h3 className="text-lg md:text-xl font-bold text-foreground">{title}</h3>
      </div>

      <div
        ref={containerRef}
        className="
          bg-gradient-to-br from-slate-900 to-slate-950 
          border border-primary/20 rounded-lg p-6 md:p-8
          overflow-x-auto
          [&_svg]:max-w-full
          [&_svg]:h-auto
          [&_.mermaidTooltip]:bg-slate-800
          [&_.mermaidTooltip]:border-primary/50
          [&_.mermaidTooltip]:text-foreground
          animate-in fade-in duration-500
        "
      />
    </motion.div>
  );
};

export default SystemDiagram;
