/**
 * Talks and awards data used by /Talks and /Awards. Pure data — safe
 * to server-render. The user said talks + awards were Tier 3 and
 * explicitly approved shipping them, so we keep the shape small and
 * avoid pulling in a CMS.
 */

export interface Talk {
    id: string;
    title: string;
    venue: string;
    /** ISO date of the talk. */
    date: string;
    description: string;
    /** Optional video / slides URL. */
    url?: string;
    /** Optional recording embed — YouTube/Vimeo iframe `src`. */
    embed?: string;
}

export interface Award {
    id: string;
    title: string;
    issuer: string;
    /** ISO date awarded. */
    date: string;
    description?: string;
    /** Optional external link. */
    url?: string;
}

export const TALKS: Talk[] = [
    {
        id: 'ieee-anomaly-detection',
        title: 'Real-Time Anomaly Detection Using Snort and Machine Learning',
        venue: 'IEEE iTech SECOM 2025',
        date: '2025-09-14',
        description:
            'How combining a classic NIDS with six unsupervised ML models catches real-world intrusions faster than rules alone.',
        url: 'https://ieeexplore.ieee.org/document/11307610',
    },
    {
        id: 'lunar-lander-rl',
        title: 'Reinforcement Learning for Autonomous Lunar Landing',
        venue: 'IEEE iTech SECOM 2025',
        date: '2025-09-13',
        description:
            'A comparative analysis of DQN, Double DQN, Dueling DQN, and PPO on LunarLander-v2 — and what that says about real-world control.',
        url: 'https://ieeexplore.ieee.org/document/11307361',
    },
];

export const AWARDS: Award[] = [
    {
        id: 'ieee-best-paper-honourable-mention',
        title: 'IEEE Best Paper — Honourable Mention',
        issuer: 'IEEE iTech SECOM 2025',
        date: '2025-09-14',
        description:
            'Recognition for the Snort + ML anomaly detection paper, awarded for novelty and real-world deployment focus.',
    },
];
