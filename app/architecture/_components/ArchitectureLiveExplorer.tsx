'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Download, Copy as CopyIcon, Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/lib/toast';
import CopyButton from '@/components/CopyButton';
import NodeDetailDrawer from '@/components/diagrams/NodeDetailDrawer';
import { cn } from '@/lib/utils';

const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), {
    ssr: false,
    loading: () => (
        <div className="flex h-32 items-center justify-center text-white/40">
            <Loader2 className="size-5 animate-spin" />
        </div>
    ),
});

const STARTER_DIAGRAMS: Record<string, string> = {
    default: `flowchart LR\n  A[User] --> B[API]\n  B --> C[Model]\n  C --> D[(DB)]`,
};

interface Props {
    initialChart?: string;
    projectSlug?: string;
}

/**
 * Live architecture editor — type mermaid, see it rendered, export to
 * SVG/PNG, copy source, snap to full-screen via ?present=1, and inspect
 * node details via the side drawer.
 */
const ArchitectureLiveExplorer = ({ initialChart, projectSlug }: Props) => {
    const initial = useMemo(
        () => initialChart ?? STARTER_DIAGRAMS.default,
        [initialChart],
    );
    const [chart, setChart] = useState(initial);
    const [present, setPresent] = useState(false);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [exporting, setExporting] = useState<'svg' | 'png' | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // ?present=1 query string flips the layout into a snap-to-viewport
    // full-screen mode. Restoring navigates back without the param.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        if (url.searchParams.get('present') === '1') setPresent(true);
    }, []);

    const handleTogglePresent = useCallback(() => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        if (present) {
            url.searchParams.delete('present');
            setPresent(false);
        } else {
            url.searchParams.set('present', '1');
            setPresent(true);
        }
        window.history.replaceState({}, '', url.toString());
    }, [present]);

    // Click on a Mermaid node → open the detail drawer.
    useEffect(() => {
        const root = containerRef.current;
        if (!root) return;

        const handler = (e: MouseEvent) => {
            const target = e.target as Element | null;
            if (!target) return;
            const node = target.closest('.node');
            if (!node) return;
            const id = node.querySelector('foreignObject div')?.textContent?.trim()
                || node.getAttribute('id')
                || '';
            if (id) setSelectedNode(id);
        };
        root.addEventListener('click', handler);
        return () => root.removeEventListener('click', handler);
    }, [chart]);

    const exportSvg = useCallback(async () => {
        if (exporting) return;
        setExporting('svg');
        try {
            const { renderMermaidToSvg, downloadSvgString } = await import('@/lib/export/svg');
            const svg = await renderMermaidToSvg(chart);
            downloadSvgString(svg, `${projectSlug ?? 'diagram'}.svg`);
            toast({ title: 'SVG downloaded', variant: 'success' });
        } catch {
            toast({ title: 'SVG export failed', variant: 'error' });
        } finally {
            setExporting(null);
        }
    }, [chart, exporting, projectSlug]);

    const exportPng = useCallback(async () => {
        if (exporting) return;
        setExporting('png');
        try {
            const { downloadMermaidPng } = await import('@/lib/export/png');
            await downloadMermaidPng(chart, `${projectSlug ?? 'diagram'}.png`);
            toast({ title: 'PNG downloaded', variant: 'success' });
        } catch {
            toast({ title: 'PNG export failed', variant: 'error' });
        } finally {
            setExporting(null);
        }
    }, [chart, exporting, projectSlug]);

    return (
        <section
            ref={containerRef}
            className={cn(
                'rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-sm transition-all',
                present
                    ? 'fixed inset-3 z-[240] flex flex-col gap-3 p-4 sm:inset-6'
                    : 'p-4 md:p-6',
            )}
            data-architecture-live
        >
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                        Live Architecture Editor
                    </p>
                    <h2 className="text-lg font-anton">
                        {projectSlug ? `Project ${projectSlug}` : 'Sandbox'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleTogglePresent}
                        aria-pressed={present}
                        aria-label={present ? 'Exit full-screen' : 'Enter full-screen'}
                        className="architecture-button !w-auto !px-3 !py-2 !text-[0.7rem]"
                    >
                        {present ? (
                            <>
                                <Minimize2 size={12} aria-hidden="true" /> Exit
                            </>
                        ) : (
                            <>
                                <Maximize2 size={12} aria-hidden="true" /> Present
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div
                className={cn(
                    'grid gap-4',
                    present ? 'grid-cols-1 lg:grid-cols-[420px_1fr]' : 'md:grid-cols-2',
                )}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                        <span>Mermaid source</span>
                        <CopyButton value={chart} label="Copy chart" />
                    </div>
                    <textarea
                        ref={inputRef}
                        value={chart}
                        onChange={(e) => setChart(e.target.value)}
                        spellCheck={false}
                        aria-label="Mermaid chart source"
                        className="min-h-[260px] flex-1 resize-y rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-white/90 outline-none focus:border-primary/50"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={exportSvg}
                            disabled={Boolean(exporting)}
                            className="architecture-button !w-auto !px-3 !py-2 !text-[0.7rem]"
                        >
                            {exporting === 'svg' ? (
                                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                            ) : (
                                <Download size={12} aria-hidden="true" />
                            )}
                            Export SVG
                        </button>
                        <button
                            type="button"
                            onClick={exportPng}
                            disabled={Boolean(exporting)}
                            className="architecture-button !w-auto !px-3 !py-2 !text-[0.7rem]"
                        >
                            {exporting === 'png' ? (
                                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                            ) : (
                                <ImageIcon size={12} aria-hidden="true" />
                            )}
                            Export PNG
                        </button>
                        <CopyButton
                            value={chart}
                            label="Copy source"
                            className="!px-3 !py-2 !text-[0.7rem]"
                        />
                    </div>
                </div>

                <div className="flex min-h-[260px] flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                        <span>Live preview · click a node for details</span>
                    </div>
                    <div className="flex-1 rounded-xl border border-white/10 bg-black/30 p-3">
                        <MermaidDiagram chart={chart} />
                    </div>
                </div>
            </div>

            <NodeDetailDrawer
                open={Boolean(selectedNode)}
                nodeId={selectedNode}
                onClose={() => setSelectedNode(null)}
            />
        </section>
    );
};

export default ArchitectureLiveExplorer;
