'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    open: boolean;
    nodeId: string | null;
    onClose: () => void;
    /** Per-node lookup. Falls back to a placeholder when the id is unknown. */
    details?: Record<string, { title: string; description: string; source?: string }>;
}

/**
 * Slide-in side drawer that reveals details for the currently-selected
 * architecture-diagram node. The detail map is supplied by the parent so
 * callers can mix static and dynamic sources.
 *
 * - Focus is moved into the drawer on open and restored on close.
 * - Closes on Escape and on backdrop click.
 * - Honours `aria-modal` and uses `role="dialog"`.
 */
const NodeDetailDrawer = ({ open, nodeId, onClose, details }: Props) => {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const lastFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;
        lastFocusRef.current = document.activeElement as HTMLElement | null;
        const t = setTimeout(() => {
            panelRef.current?.focus();
        }, 50);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            clearTimeout(t);
            window.removeEventListener('keydown', onKey);
            lastFocusRef.current?.focus?.();
        };
    }, [open, onClose]);

    if (!open || !nodeId) return null;

    const detail =
        details?.[nodeId] ?? {
            title: nodeId,
            description:
                'Detail for this architecture node will land here. Per-node deep dives describe responsibilities, data flow, and source-code anchors.',
        };

    return (
        <div
            className="fixed inset-0 z-[250] flex"
            aria-hidden={!open}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="flex-1 bg-black/55 backdrop-blur-sm" />
            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={detail.title}
                className={cn(
                    'h-full w-[min(420px,90vw)] overflow-y-auto border-l border-white/10 bg-zinc-950/95 p-6 shadow-2xl outline-none',
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                            Node
                        </p>
                        <h3 className="mt-1 text-xl font-anton text-white">
                            {detail.title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close node detail"
                        className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10"
                    >
                        <X size={16} />
                    </button>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                    {detail.description}
                </p>
                {detail.source && (
                    <pre className="mt-5 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] text-white/70">
                        <code>{detail.source}</code>
                    </pre>
                )}
                <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                    TODO: link to source file · commit hash · related PRs
                </p>
            </div>
        </div>
    );
};

export default NodeDetailDrawer;
