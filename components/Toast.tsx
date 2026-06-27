'use client';

import { useToasts, toastStore } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useReducedMotion } from '@/lib/motion-prefs';

const variantClasses: Record<string, string> = {
    default: 'border-white/15 bg-zinc-950/95 text-white',
    success: 'border-primary/40 bg-zinc-950/95 text-primary',
    error: 'border-red-500/40 bg-zinc-950/95 text-red-300',
    info: 'border-secondary/40 bg-zinc-950/95 text-secondary',
};

const variantIcons: Record<string, typeof CheckCircle2> = {
    default: Info,
    success: CheckCircle2,
    error: XCircle,
    info: Info,
};

const ToastViewport = () => {
    const toasts = useToasts();
    const reducedMotion = useReducedMotion();

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="pointer-events-none fixed bottom-6 right-6 z-[200] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2"
        >
            {toasts.map((t) => {
                const Icon = variantIcons[t.variant ?? 'default'] ?? Info;
                return (
                    <div
                        key={t.id}
                        role={t.variant === 'error' ? 'alert' : 'status'}
                        className={cn(
                            'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md',
                            'transition-all duration-300',
                            reducedMotion ? 'opacity-100' : 'animate-toast-in',
                            variantClasses[t.variant ?? 'default'],
                        )}
                    >
                        <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight">{t.title}</p>
                            {t.description && (
                                <p className="mt-0.5 text-xs opacity-80">{t.description}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            aria-label="Dismiss"
                            onClick={() => toastStore.dismiss(t.id)}
                            className="shrink-0 opacity-60 hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-toast-in { animation: toastIn 240ms ease-out both; }
                @media (prefers-reduced-motion: reduce) {
                    .animate-toast-in { animation: none !important; }
                }
            `}</style>
        </div>
    );
};

export default ToastViewport;
