import Groq from 'groq-sdk';

/**
 * Shared Groq client wrapper.
 *
 * Centralizes initialization so every API route uses the same pattern.
 * Returns `null` when the API key is missing so callers can fall back to
 * a deterministic offline response.
 *
 * Never logs the API key. Never throws on missing key.
 */

let cachedClient: Groq | null = null;
let initialized = false;

export function hasGroqKey(): boolean {
    return Boolean(process.env.GROQ_API_KEY);
}

export function getGroqClient(): Groq | null {
    if (!hasGroqKey()) return null;
    if (!initialized) {
        cachedClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
        initialized = true;
    }
    return cachedClient;
}

export function resetGroqClient(): void {
    cachedClient = null;
    initialized = false;
}

/**
 * Standard offline-fallback response for AI routes.
 * Returns a streaming Response that emits a single message and closes.
 */
export function groqUnavailableResponse(message?: string): Response {
    const fallback =
        message ??
        "I'm running offline right now — no live AI behind the curtain. " +
        'In the meantime, the Projects, Experience, and Open Source sections on ' +
        'the portfolio have richer detail than I could summarise. ' +
        'You can also hit ⌘/Ctrl + K to jump anywhere on the site.';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(fallback));
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}

/**
 * Stable error code for log lines.
 * Routes can call this so PII (stack traces, request bodies, file paths)
 * never lands in shared logs.
 */
export function logAiError(route: string, code: string, extra?: Record<string, unknown>): void {
    if (extra && Object.keys(extra).length > 0) {
        // eslint-disable-next-line no-console
        console.error(`[ai:${route}] ${code}`, JSON.stringify(extra));
    } else {
        // eslint-disable-next-line no-console
        console.error(`[ai:${route}] ${code}`);
    }
}
