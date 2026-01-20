'use client';

import { useEffect, useState, useRef, memo } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
}

// Initialize mermaid once outside component
let initialized = false;
const initMermaid = () => {
    if (initialized) return;
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        flowchart: {
            htmlLabels: true,
            useMaxWidth: false,
            nodeSpacing: 50,
            rankSpacing: 60,
            curve: 'basis',
            padding: 16,
        },
        themeVariables: {
            background: 'transparent',
            primaryColor: 'rgba(30, 41, 59, 0.85)',
            primaryBorderColor: '#10b981',
            primaryTextColor: '#e2e8f0',
            lineColor: '#475569',
            textColor: '#e2e8f0',
            mainBkg: 'rgba(30, 41, 59, 0.7)',
            nodeBorder: '#10b981',
            clusterBkg: 'transparent',
            clusterBorder: '#334155',
            edgeLabelBackground: 'rgba(15, 23, 42, 0.9)',
        },
    });
    initialized = true;
};

// Sanitize mermaid chart to prevent parse errors
const sanitizeChart = (chart: string): string => {
    if (!chart) return '';

    try {
        let sanitized = chart
            // Normalize quotes
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            // Ensure proper line endings
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            // Preserve node labels - don't collapse spaces inside brackets
            // Clean up multiple consecutive spaces outside brackets
            .replace(/(?<!\[[^\]]*)[ \t]+(?!.*\])/g, ' ')
            // Remove excessive empty lines (max 2 consecutive)
            .replace(/\n{3,}/g, '\n\n')
            // Ensure proper graph declaration format (keyword lowercase, direction uppercase)
            .replace(/^(graph|flowchart)\s+(TD|LR|TB|BT|RL)/i, (match, keyword, direction) => {
                return `${keyword.toLowerCase()} ${direction.toUpperCase()}`;
            })
            // Fix common syntax issues
            .replace(/-->/g, '-->')
            .replace(/--/g, '--')
            // Ensure node IDs are valid (alphanumeric, no spaces)
            .replace(/\[([^\]]+)\]/g, (match, content) => {
                // Keep content but ensure brackets are properly formatted
                return `[${content.trim()}]`;
            })
            .trim();

        // Validate basic structure
        if (!sanitized.match(/^(graph|flowchart)\s+(TD|LR|TB|BT|RL)/i)) {
            // Try to fix if missing declaration
            if (!sanitized.includes('graph') && !sanitized.includes('flowchart')) {
                sanitized = `graph TD\n${sanitized}`;
            }
        }

        return sanitized;
    } catch (e) {
        // If sanitization fails, return original - error handling will catch parse issues
        return chart;
    }
};

const MermaidDiagram = memo(({ chart }: MermaidDiagramProps) => {
    const [svg, setSvg] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const idRef = useRef(`m-${Math.random().toString(36).slice(2, 9)}`);
    const renderAttempts = useRef(0);

    useEffect(() => {
        initMermaid();

        let cancelled = false;
        renderAttempts.current = 0;
        setError(null);

        const render = async () => {
            if (!chart) return;

            const sanitized = sanitizeChart(chart);

            try {
                // Generate a unique ID for each render attempt
                const uniqueId = `${idRef.current}-${renderAttempts.current++}`;
                const { svg: result } = await mermaid.render(uniqueId, sanitized);

                if (!cancelled) {
                    setSvg(result);
                    // Staggered fade-in animation
                    requestAnimationFrame(() => {
                        setTimeout(() => setVisible(true), 50);
                    });
                }
            } catch (e: any) {
                console.error('Mermaid render error:', e);
                // Try to extract a meaningful error message
                const msg = e?.message || 'Failed to render diagram';

                if (!cancelled) {
                    setError(msg);
                    setSvg('');
                    setVisible(false);
                }
            }
        };

        setVisible(false);
        setSvg('');
        render();

        return () => { cancelled = true; };
    }, [chart]);

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-400 border border-red-900/30 bg-red-950/10 rounded-lg p-4 text-center">
                <div className="max-w-md">
                    <p className="font-semibold mb-2">Diagram Error</p>
                    <p className="text-xs opacity-70 font-mono break-all">{error}</p>
                    <p className="text-xs opacity-50 mt-2">Check console for details</p>
                </div>
            </div>
        );
    }

    // Show loading state while rendering
    if (!svg) {
        return (
            <div className="mermaid-loading flex items-center justify-center h-64">
                <div className="mermaid-loading__spinner w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`mermaid-wrap ${visible ? 'mermaid-wrap--visible' : ''}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
});

MermaidDiagram.displayName = 'MermaidDiagram';

export default MermaidDiagram;
