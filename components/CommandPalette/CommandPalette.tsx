'use client';

import {
    KBarAnimator,
    KBarPortal,
    KBarPositioner,
    KBarResults,
    KBarSearch,
    KBarProvider,
    useMatches,
    useKBar,
    Action,
} from 'kbar';
import { useEffect } from 'react';
import { PROJECTS, MY_CONTRIBUTIONS, GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const RECENT_KEY = 'kbar:recent';
const RECENT_MAX = 6;

const paletteActions: Action[] = [
    {
        id: 'home',
        name: 'Home',
        shortcut: ['g', 'h'],
        keywords: 'home landing banner top',
        perform: () => (window.location.href = '/'),
        section: 'Navigation',
    },
    {
        id: 'projects',
        name: 'Projects',
        shortcut: ['g', 'p'],
        keywords: 'projects portfolio work',
        perform: () => (window.location.href = '/#selected-projects'),
        section: 'Navigation',
    },
    {
        id: 'architecture',
        name: 'Architecture Explorer',
        shortcut: ['g', 'a'],
        keywords: 'architecture mermaid system design',
        perform: () => (window.location.href = '/architecture'),
        section: 'Navigation',
    },
    {
        id: 'uses',
        name: 'Uses',
        shortcut: ['g', 'u'],
        keywords: 'uses tools hardware editor setup',
        perform: () => (window.location.href = '/uses'),
        section: 'Navigation',
    },
    {
        id: 'blog',
        name: 'Blog',
        shortcut: ['g', 'b'],
        keywords: 'blog posts field notes writing',
        perform: () => (window.location.href = '/blog'),
        section: 'Navigation',
    },
    {
        id: 'opensource',
        name: 'Open Source',
        shortcut: ['g', 'o'],
        keywords: 'open source oss github contributions',
        perform: () => (window.location.href = '/#open-source'),
        section: 'Navigation',
    },
    {
        id: 'contact',
        name: 'Contact',
        shortcut: ['g', 'c'],
        keywords: 'contact email phone',
        perform: () => (window.location.href = '/#contact'),
        section: 'Navigation',
    },
    ...PROJECTS.map((p) => ({
        id: `project:${p.slug}`,
        name: p.title,
        keywords: `project ${p.title} ${p.techAndTechniques?.join(' ') ?? ''}`,
        perform: () => (window.location.href = `/projects/${p.slug}`),
        section: 'Projects',
    })),
    ...MY_CONTRIBUTIONS.map((c) => ({
        id: `oss:${c.slug}`,
        name: c.title,
        keywords: `open source ${c.org} ${c.techStack?.join(' ') ?? ''}`,
        perform: () => (window.location.href = `/opensource/${c.slug}`),
        section: 'Open Source',
    })),
    {
        id: 'copy:email',
        name: 'Copy Email',
        keywords: 'email contact copy',
        perform: () => copyToClipboard(GENERAL_INFO.email, 'Email'),
        section: 'Quick Actions',
    },
    {
        id: 'copy:phone',
        name: 'Copy Phone',
        keywords: 'phone contact copy number',
        perform: () => copyToClipboard(GENERAL_INFO.phone, 'Phone'),
        section: 'Quick Actions',
    },
    ...SOCIAL_LINKS.map((link) => ({
        id: `social:${link.name}`,
        name: `Open ${link.name}`,
        keywords: `${link.name} social link`,
        perform: () => window.open(link.url, '_blank', 'noopener,noreferrer'),
        section: 'Socials',
    })),
];

async function copyToClipboard(text: string, label: string) {
    try {
        await navigator.clipboard.writeText(text);
        toast({ title: `${label} copied`, description: text, variant: 'success' });
    } catch {
        toast({ title: `Couldn't copy ${label.toLowerCase()}`, variant: 'error' });
    }
}

// `kbar` exposes `query.setSearch(...)` but not a synchronous getter; we track
// the current query string locally via a small pub-sub store.
import { useKbarQuery, setQuery as setKbarQuery } from './kbar-search-store';

const StyledSearch = () => (
    <KBarSearch
        className="w-full bg-transparent px-5 py-4 text-base text-white outline-none placeholder:text-white/40"
        placeholder="Search sections, projects, OSS, actions…"
        onChange={(event) => setKbarQuery((event.target as HTMLInputElement).value)}
    />
);

const StyledResults = () => {
    const { results } = useMatches();
    const query = useKbarQuery();
    const isEmpty = results.length === 0;

    return (
        <>
            <KBarResults
                items={results}
                onRender={({ item, active }) =>
                    typeof item === 'string' ? (
                        <div className="px-5 pb-1 pt-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
                            {item}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors',
                                active ? 'bg-primary/15 text-primary' : 'text-white/85',
                            )}
                        >
                            <span className="flex-1 truncate">{item.name}</span>
                            {item.shortcut?.length ? (
                                <span className="flex gap-1 text-[10px] text-white/40 font-mono">
                                    {item.shortcut.map((s) => (
                                        <kbd
                                            key={s}
                                            className="rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5"
                                        >
                                            {s}
                                        </kbd>
                                    ))}
                                </span>
                            ) : null}
                        </div>
                    )
                }
            />
            {isEmpty && query.trim().length > 0 && (
                <div
                    className="flex flex-col items-center gap-2 px-6 py-10 text-center"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-sm font-mono uppercase tracking-[0.3em] text-white/40">
                        No matches
                    </p>
                    <p className="text-sm text-white/70">
                        Nothing matches{' '}
                        <span className="text-primary">&ldquo;{query}&rdquo;</span>.
                        Try{' '}
                        <span className="text-primary">
                            project, architecture, github, contact
                        </span>
                        , or press <kbd className="rounded border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-xs">esc</kbd>{' '}
                        to close.
                    </p>
                </div>
            )}
        </>
    );
};

const Inner = () => {
    const kbar = useKBar();

    // Restore the most recent query so the palette reopens with context.
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(RECENT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as string[];
                if (Array.isArray(parsed) && parsed.length) {
                    kbar.query.setSearch(parsed[0]);
                }
            }
        } catch {
            // ignore
        }
    }, [kbar]);

    // Persist recent queries in localStorage so the next session starts with
    // suggestions. Errors are ignored (Safari private mode, SSR, etc.).
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const unsubscribe = kbar.options.callbacks?.onQueryChange;
        // No subscribe API in this kbar build; poll input via a MutationObserver
        // is overkill. Instead, hook into the document input event.
        const onInput = (e: Event) => {
            const target = e.target as HTMLInputElement | null;
            if (!target) return;
            try {
                const q = target.value.trim();
                if (!q) return;
                const raw = window.localStorage.getItem(RECENT_KEY);
                const parsed = raw ? (JSON.parse(raw) as string[]) : [];
                const next = [q, ...parsed.filter((x) => x !== q)].slice(0, RECENT_MAX);
                window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
            } catch {
                // ignore
            }
        };
        document.addEventListener('input', onInput, true);
        return () => {
            document.removeEventListener('input', onInput, true);
            if (unsubscribe) void unsubscribe;
        };
    }, [kbar]);

    // Suppress `/` when focus is inside an editable field — kbar's own key
    // listener fires on `keydown` but we add an extra guard so accidental
    // `/` typing inside inputs doesn't pop the palette.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const tag = target.tagName;
            const editable =
                tag === 'INPUT' ||
                tag === 'TEXTAREA' ||
                target.isContentEditable;
            if (editable && e.key === '/') {
                e.stopPropagation();
            }
        };
        window.addEventListener('keydown', onKey, { capture: true });
        return () => window.removeEventListener('keydown', onKey, { capture: true });
    }, []);

    return (
        <KBarPortal>
            <KBarPositioner className="z-[300] fixed inset-0 bg-black/60 backdrop-blur-sm">
                <KBarAnimator className="w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl">
                    <StyledSearch />
                    <div className="max-h-[60vh] overflow-y-auto border-t border-white/5">
                        <StyledResults />
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
                        <span>↑ ↓ navigate</span>
                        <span>↵ open</span>
                        <span>esc close</span>
                    </div>
                </KBarAnimator>
            </KBarPositioner>
        </KBarPortal>
    );
};

const CommandPalette = () => {
    return (
        <KBarProvider actions={paletteActions}>
            <Inner />
        </KBarProvider>
    );
};

export default CommandPalette;
