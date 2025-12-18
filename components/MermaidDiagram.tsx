'use client';

import { useCallback, useEffect, useState } from 'react';
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
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const [copyStatus, setCopyStatus] = useState('');

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
    }, [chart, retryKey]);

    const handleRetry = useCallback(() => {
        setRetryKey((prev) => prev + 1);
    }, []);

    const handleCopy = useCallback(async () => {
        if (!chart) {
            setCopyStatus('Nothing to copy yet');
            return;
        }
        try {
            await navigator.clipboard.writeText(chart);
            setCopyStatus('Copied to clipboard');
        } catch (err) {
            setCopyStatus('Clipboard unavailable');
            console.error('Mermaid copy error:', err);
        }

        setTimeout(() => setCopyStatus(''), 2000);
    }, [chart]);

    if (error) {
        return (
            <div className="p-2 border border-red-500/20 bg-red-500/10 rounded text-red-400 text-xs font-mono">
                {error}
                <pre className="mt-1 opacity-50">{chart}</pre>
                <div className="mt-3 flex flex-wrap gap-2">
                    <button
                        onClick={handleRetry}
                        className="px-3 py-1 rounded bg-white/10 text-xs text-white hover:bg-white/20 transition"
                    >
                        Retry
                    </button>
                    <button
                        onClick={handleCopy}
                        className="px-3 py-1 rounded bg-white/10 text-xs text-white hover:bg-white/20 transition"
                    >
                        Copy raw diagram
                    </button>
                    {copyStatus && <span className="text-xs text-zinc-300 italic">{copyStatus}</span>}
                </div>
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
