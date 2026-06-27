'use client';

import { useMemo } from 'react';
import { parseArchitectureDiagram, type BoxPos, type EdgePos } from '@/lib/architecture/diagram-parser';

/**
 * LiveArchitectureOverlay
 *
 * Renders a separate DOM layer ABOVE the existing ASCII architecture diagram.
 * The ASCII text in `SystemArchitectureDiagrams` is never modified — the overlay
 * uses `position: absolute; inset: 0; pointer-events: none` and positions its
 * children via CSS `ch` / `em` units derived from the diagram parser.
 *
 * Visual elements (all Supabase-style, no blinking):
 * - Status dot in the top-right corner of each box (soft pulse, no flash).
 * - Animated data packets that travel down the connector lines between boxes,
 *   staggered for a continuous flow effect.
 * - Thin cyan gradient lines on each connector that gently shimmer.
 * - A horizontal scan-line that sweeps down the diagram every ~7s.
 *
 * The overlay reads the same monospace diagram that the underlying component
 * renders, so box numbering and connector positions are always in sync.
 */

interface Props {
    text: string;
}

const PACKETS_PER_EDGE = 3;
const SCANLINE_LINES_BIAS = 2; // Scanline is offset by 2 lines so it starts just below the first box

function buildConnectorLineStyle(edge: EdgePos) {
    return {
        top: `calc(${edge.line} * 1em)`,
        left: `calc(${edge.col} * 1ch)`,
        height: 'calc(1.2em)',
    };
}

function buildStatusStyle(box: BoxPos) {
    return {
        top: `calc(${box.topLine} * 1em + 0.4em)`,
        left: `calc(${box.rightCol} * 1ch + 0.6ch)`,
    };
}

function buildPacketStyle(edge: EdgePos, packetIndex: number) {
    // Stagger packet start within a single connector by spreading over the
    // 1.8s animation cycle. Each packet has a different delay.
    const delay = `${(packetIndex * 1.8) / PACKETS_PER_EDGE}s`;
    return {
        top: `calc(${edge.line} * 1em)`,
        left: `calc(${edge.col} * 1ch)`,
        animationDelay: delay,
    } as React.CSSProperties;
}

function buildScanlineStyle(lineCount: number) {
    return {
        top: `calc(${SCANLINE_LINES_BIAS} * 1em)`,
        // Cap the line count so the scanline stays inside the container
        // for very tall diagrams.
        maxTop: `calc(${Math.max(lineCount - 4, SCANLINE_LINES_BIAS + 4)} * 1em)`,
    };
}

const LiveArchitectureOverlay = ({ text }: Props) => {
    const parsed = useMemo(() => parseArchitectureDiagram(text), [text]);

    const orderedEdges: EdgePos[] = useMemo(() => {
        // Sort edges by `fromBox` so packets flow in a predictable
        // top-to-bottom visual rhythm.
        return [...parsed.edges].sort((a, b) => {
            if (a.fromBox !== b.fromBox) return a.fromBox - b.fromBox;
            return a.line - b.line;
        });
    }, [parsed.edges]);

    if (!parsed.boxes.length) return null;

    return (
        <div className="live-arch-overlay" aria-hidden="true">
            {/* Status indicators — one per box, soft pulse */}
            {parsed.boxes.map((box) => (
                <div
                    key={`status-${box.number}`}
                    className="live-arch-status"
                    style={buildStatusStyle(box)}
                />
            ))}

            {/* Connector lines — thin cyan gradient that shimmers */}
            {orderedEdges.map((edge) => {
                const key = `line-${edge.fromBox}-${edge.toBox}-${edge.line}`;
                return (
                    <div
                        key={key}
                        className="live-arch-connector-line"
                        style={{
                            ...buildConnectorLineStyle(edge),
                            animationDelay: `${(edge.fromBox * 0.15) % 2.4}s`,
                        } as React.CSSProperties}
                    />
                );
            })}

            {/* Data packets — multiple per connector, staggered for continuous flow */}
            {orderedEdges.map((edge) => {
                const keyBase = `packet-${edge.fromBox}-${edge.toBox}-${edge.line}`;
                return (
                    <ArrayParam key={keyBase} edge={edge} />
                );
            })}

            {/* Scan-line — sweeps down the diagram every ~7s */}
            <div
                className="live-arch-scanline"
                style={buildScanlineStyle(parsed.lineCount) as React.CSSProperties}
            />
        </div>
    );
};

// Helper component (declared here so the parent's `return` JSX stays compact).
function ArrayParam({ edge }: { edge: EdgePos }) {
    const items: JSX.Element[] = [];
    for (let i = 0; i < PACKETS_PER_EDGE; i++) {
        const directionClass =
            edge.direction === 'up' ? 'live-arch-packet-up' : 'live-arch-packet-down';
        items.push(
            <div
                key={`p-${i}`}
                className={`live-arch-packet ${directionClass}`}
                style={buildPacketStyle(edge, i)}
            />,
        );
    }
    return <>{items}</>;
}

export default LiveArchitectureOverlay;
