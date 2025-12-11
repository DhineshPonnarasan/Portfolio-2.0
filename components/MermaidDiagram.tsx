'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'inherit',
});

interface MermaidDiagramProps {
    chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return;
            
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render diagram');
            }
        };

        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className="p-2 border border-red-500/20 bg-red-500/10 rounded text-red-400 text-xs font-mono">
                {error}
                <pre className="mt-1 opacity-50">{chart}</pre>
            </div>
        );
    }

    return (
        <div 
            className="mermaid-diagram my-4 overflow-x-auto bg-white/5 p-4 rounded-lg flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default MermaidDiagram;
