'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import type { VisualAsset } from '@/types';
import { cn } from '@/lib/utils';

// Lazy-load the actual lightbox on click — keeps it out of the home route
// chunk until the user actually opens a gallery.
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
    ssr: false,
});

interface Slide {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}

interface Props {
    visuals?: VisualAsset[];
}

const isLikelyImage = (src: string) =>
    /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(src) ||
    src.startsWith('/projects/');

const ProjectDemoGallery = ({ visuals }: Props) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const slides: Slide[] = (visuals ?? [])
        .filter((v) => v?.image && isLikelyImage(v.image))
        .map((v) => ({ src: v.image, alt: v.label || v.prompt }));

    const handleOpen = useCallback((i: number) => {
        setIndex(i);
        setOpen(true);
    }, []);

    if (slides.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {slides.map((s, i) => (
                    <button
                        key={s.src + i}
                        type="button"
                        onClick={() => handleOpen(i)}
                        aria-label={`Open ${s.alt ?? 'image'} in lightbox`}
                        className={cn(
                            'group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]',
                            'transition-all hover:border-primary/50 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]',
                        )}
                    >
                        <Image
                            src={s.src}
                            alt={s.alt ?? ''}
                            fill
                            sizes="(min-width: 768px) 33vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                            <ZoomIn size={20} className="text-white" aria-hidden="true" />
                        </span>
                    </button>
                ))}
            </div>

            {open && (
                <Lightbox
                    open={open}
                    index={index}
                    close={() => setOpen(false)}
                    slides={slides}
                    controller={{ closeOnBackdropClick: true }}
                />
            )}
        </>
    );
};

export default ProjectDemoGallery;
