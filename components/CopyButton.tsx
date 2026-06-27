'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface Props {
    value: string;
    label?: string;
    className?: string;
}

/**
 * Tiny copy-to-clipboard button. Uses `navigator.clipboard.writeText` with
 * a graceful fallback to `document.execCommand('copy')` when the modern API
 * is unavailable (e.g. http on localhost in some browsers, very old Safari).
 *
 * Surfaces success/error via the toast system from PR #3.
 */
const CopyButton = ({ value, label = 'Copy', className }: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                const ta = document.createElement('textarea');
                ta.value = value;
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            setCopied(true);
            toast({ title: `${label} copied`, variant: 'success' });
            setTimeout(() => setCopied(false), 1600);
        } catch {
            toast({ title: `Couldn't copy ${label.toLowerCase()}`, variant: 'error' });
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
            aria-live="polite"
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-primary/50 hover:text-primary',
                className,
            )}
        >
            {copied ? (
                <>
                    <Check size={12} aria-hidden="true" />
                    Copied
                </>
            ) : (
                <>
                    <Copy size={12} aria-hidden="true" />
                    {label}
                </>
            )}
        </button>
    );
};

export default CopyButton;
