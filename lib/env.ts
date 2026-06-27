/**
 * Centralised, type-safe access to environment variables.
 *
 * Every env var the codebase touches is declared here. Anything missing that
 * is *required* surfaces at module load (server) with a clear error — never
 * at request time. Optional vars resolve to `undefined` so callers can branch.
 *
 * `NEXT_PUBLIC_*` vars are inlined at build time by Next.js, so this file is
 * safe to import from both server and client components.
 */

const isServer = typeof window === 'undefined';

const requireEnv = (key: string, fallback?: string): string => {
    const value = process.env[key] ?? fallback;
    if (!value) {
        // Server-side: throw loud so a missing var is caught at startup.
        // Client-side: never reach here for public vars (they're inlined).
        if (isServer) {
            throw new Error(
                `[env] Missing required environment variable: ${key}. ` +
                    `Add it to .env.local (see .env.example).`,
            );
        }
        return '';
    }
    return value;
};

const optionalEnv = (key: string): string | undefined => {
    const value = process.env[key];
    return value && value.length > 0 ? value : undefined;
};

const boolFromEnv = (key: string, fallback: boolean): boolean => {
    const raw = process.env[key]?.toLowerCase();
    if (raw === undefined) return fallback;
    return raw === '1' || raw === 'true' || raw === 'yes';
};

export const env = {
    /** AI provider — currently Groq. */
    groq: {
        apiKey: optionalEnv('GROQ_API_KEY'),
    },
    /** Public site URL used by metadata, sitemap, robots, JSON-LD. */
    siteUrl: optionalEnv('NEXT_PUBLIC_SITE_URL') ?? 'https://me.toinfinite.dev',
    /** Google Analytics measurement ID. Disabled when blank. */
    gaMeasurementId: optionalEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
    /** Hotjar site ID. Disabled when blank. */
    hotjarId: optionalEnv('NEXT_PUBLIC_HOTJAR_ID'),
    /** LeetCode username. Off when blank. */
    leetcodeUsername: optionalEnv('NEXT_PUBLIC_LEETCODE_USERNAME'),
    /** Calendly URL. Footer hides the CTA when blank. */
    calendlyUrl: optionalEnv('NEXT_PUBLIC_CALENDLY_URL'),
    /** Build-time flag from `NEXT_PUBLIC_*` so the client can render build badges. */
    isProduction: boolFromEnv('NEXT_PUBLIC_PRODUCTION', false),
} as const;

export type Env = typeof env;

/**
 * Convenience: assert the Groq key is set when calling AI routes that need
 * it. Routes already handle the missing-key case (offline fallback), so this
 * helper is for code that *requires* AI and should fail fast if misconfigured.
 */
export function assertGroqConfigured(): void {
    requireEnv('GROQ_API_KEY', env.groq.apiKey);
}