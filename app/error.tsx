'use client';

import Link from 'next/link';
import { Home, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.3em] text-red-400">
                <AlertTriangle size={12} aria-hidden="true" />
                Something tripped
            </div>
            <h1 className="text-5xl md:text-6xl font-anton text-primary">500</h1>
            <p className="max-w-md text-lg text-white/75">
                That route hit an unexpected exception. It&apos;s logged with a stable
                code so I can fix it on my side.
            </p>
            {process.env.NODE_ENV === 'development' && error.message && (
                <p className="max-w-md break-all rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white/40">
                    {error.message}
                </p>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                    <RefreshCw size={14} aria-hidden="true" />
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary"
                >
                    <Home size={14} aria-hidden="true" />
                    Back to home
                </Link>
            </div>
        </main>
    );
}