import { NextResponse } from 'next/server';
import { logAiError } from '@/lib/groq';

/**
 * Maximum JSON body size we'll accept on a POST endpoint.
 * Prevents accidental abuse from oversized payloads.
 */
export const MAX_JSON_BYTES = 32 * 1024; // 32 KB

/**
 * Parsed shape guard for unknown error objects thrown inside API routes.
 * Returns a safe-to-log code + optional message.
 */
export function describeRouteError(route: string, error: unknown): { code: string; status?: number } {
    const err = error as { status?: number; code?: string; error?: { code?: string } } | null;
    if (err && typeof err === 'object') {
        const status = typeof err.status === 'number' ? err.status : undefined;
        const code =
            err.error?.code ||
            (typeof err.code === 'string' ? err.code : undefined) ||
            'unhandled_error';
        logAiError(route, code, { status });
        return { code, status };
    }
    logAiError(route, 'unhandled_error');
    return { code: 'unhandled_error' };
}

/**
 * Wrap an async JSON-parsing call so we can:
 *  - reject oversized bodies
 *  - return a friendly 400 instead of an opaque SyntaxError
 */
export async function readJsonBody<T = unknown>(
    req: Request,
    route: string,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
    const contentLength = Number(req.headers.get('content-length') || '0');
    if (contentLength && contentLength > MAX_JSON_BYTES) {
        return {
            ok: false,
            response: NextResponse.json(
                { error: 'Request body is too large.' },
                { status: 413 },
            ),
        };
    }

    let text: string;
    try {
        text = await req.text();
    } catch {
        return {
            ok: false,
            response: NextResponse.json(
                { error: 'Unable to read request body.' },
                { status: 400 },
            ),
        };
    }

    if (text.length > MAX_JSON_BYTES) {
        return {
            ok: false,
            response: NextResponse.json(
                { error: 'Request body is too large.' },
                { status: 413 },
            ),
        };
    }

    if (!text.trim()) {
        return {
            ok: false,
            response: NextResponse.json({ error: 'Empty request body.' }, { status: 400 }),
        };
    }

    try {
        const data = JSON.parse(text) as T;
        return { ok: true, data };
    } catch {
        logAiError(route, 'invalid_json');
        return {
            ok: false,
            response: NextResponse.json(
                { error: 'Malformed JSON in request body.' },
                { status: 400 },
            ),
        };
    }
}

/**
 * Coerce a possibly-missing field to a non-empty trimmed string.
 */
export function requireString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

/**
 * Coerce a possibly-missing field to a positive integer.
 */
export function requirePositiveInt(value: unknown): number | null {
    const n = typeof value === 'string' ? Number(value) : (value as number);
    if (typeof n !== 'number' || !Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
        return null;
    }
    return n;
}