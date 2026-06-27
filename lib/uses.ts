/**
 * Catalogue of the hardware, software, and services that power Dhinesh's
 * day-to-day workflow. Used by `/uses`. Pure data — no imports, no side
 * effects — so it can be safely server-rendered and chunk-split.
 */

export type UseCategory =
    | 'Editor & Terminal'
    | 'Daily Drivers'
    | 'Design'
    | 'Cloud & Infra'
    | 'Productivity'
    | 'Audio & Hardware';

export interface UseItem {
    name: string;
    description: string;
    /** Simple Icons slug used for the lazy-loaded icon. */
    icon: string;
    link?: string;
}

export interface UseGroup {
    category: UseCategory;
    items: UseItem[];
}

export const USES: UseGroup[] = [
    {
        category: 'Editor & Terminal',
        items: [
            {
                name: 'VS Code',
                description: 'Primary IDE with Vim bindings. Lives in a portable install so my config follows me.',
                icon: 'vscode',
                link: 'https://code.visualstudio.com/',
            },
            {
                name: 'Warp',
                description: 'Block-based terminal with command search and sharing. Falls back to iTerm2 when remote.',
                icon: 'warp',
                link: 'https://warp.dev/',
            },
            {
                name: 'tmux',
                description: 'Multi-pane session manager — every long-running process lives in its own pane.',
                icon: 'tmux',
            },
        ],
    },
    {
        category: 'Daily Drivers',
        items: [
            {
                name: 'Notion',
                description: 'Specs, journals, and one-on-one notes. The single source of personal context.',
                icon: 'notion',
                link: 'https://www.notion.so/',
            },
            {
                name: 'Arc',
                description: 'Browser with spaces per project. Sidebar tab groups keep research noise out of the work tab.',
                icon: 'arcbrowser',
            },
            {
                name: 'Raycast',
                description: 'Launcher, clipboard, snippets, and window manager in one.',
                icon: 'raycast',
                link: 'https://www.raycast.com/',
            },
        ],
    },
    {
        category: 'Design',
        items: [
            {
                name: 'Figma',
                description: 'Wireframes and quick mockups. Auto-layout keeps explorations fast.',
                icon: 'figma',
                link: 'https://figma.com/',
            },
            {
                name: 'Excalidraw',
                description: 'Sketches for system diagrams that don\'t need full polish.',
                icon: 'excalidraw',
            },
        ],
    },
    {
        category: 'Cloud & Infra',
        items: [
            {
                name: 'Vercel',
                description: 'This site + every Next.js sandbox deploys here. Preview URLs are non-negotiable.',
                icon: 'vercel',
                link: 'https://vercel.com/',
            },
            {
                name: 'Render',
                description: 'Long-running FastAPI services and background workers.',
                icon: 'render',
                link: 'https://render.com/',
            },
            {
                name: 'GitHub Actions',
                description: 'All CI/CD. Pinned to commit SHAs for security.',
                icon: 'githubactions',
            },
        ],
    },
    {
        category: 'Productivity',
        items: [
            {
                name: 'Linear',
                description: 'Issue tracking and weekly planning. Issue-first culture across personal projects.',
                icon: 'linear',
            },
            {
                name: 'Cron / n8n',
                description: 'Self-hosted automations for backups, monitoring, and quiet cron jobs.',
                icon: 'n8n',
            },
        ],
    },
    {
        category: 'Audio & Hardware',
        items: [
            {
                name: 'Sony WH-1000XM5',
                description: 'Noise-cancelling over-ears. Long focus sessions on flights.',
                icon: 'sony',
            },
            {
                name: 'Keychron K3 Pro',
                description: 'Low-profile mechanical keyboard with browns. Compact enough for a tray on flights.',
                icon: 'keychron',
            },
        ],
    },
];
