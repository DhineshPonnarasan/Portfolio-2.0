/**
 * In-memory per-IP rate limiter for API routes.
 *
 * Simple token bucket. Suitable for a single-instance Next.js deploy.
 * For multi-instance production, swap to a shared store (Redis, Upstash).
 */

type Bucket = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Cap stored keys to avoid unbounded memory growth.
const MAX_KEYS = 5_000;

function prune(_now: number) {
    if (buckets.size <= MAX_KEYS) return;
    // Drop the oldest-resetting buckets first.
    const sorted = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
    const toRemove = sorted.slice(0, buckets.size - MAX_KEYS);
    for (const [k] of toRemove) buckets.delete(k);
}

export type RateLimitOptions = {
    route: string;
    limit: number;
    windowMs: number;
};

export type RateLimitDecision =
    | { allowed: true }
    | { allowed: false; retryAfterSeconds: number };

/**
 * Compute a rate-limit decision for a key (typically an IP) without consuming a token.
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitDecision {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
        return { allowed: true };
    }
    if (bucket.count >= options.limit) {
        return {
            allowed: false,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }
    return { allowed: true };
}

/**
 * Consume one token from the bucket for the given key.
 * Returns the decision after consumption.
 */
export function consumeRateLimit(key: string, options: RateLimitOptions): RateLimitDecision {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
        buckets.set(key, { count: 1, resetAt: now + options.windowMs });
        prune(now);
        return { allowed: true };
    }
    if (bucket.count >= options.limit) {
        return {
            allowed: false,
            retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
    }
    bucket.count += 1;
    return { allowed: true };
}

/**
 * Extract a stable client identifier from a Next.js request.
 * Falls back to "unknown" if no forwarded header is present.
 */
export function getClientKey(req: Request): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) {
        const first = xff.split(',')[0]?.trim();
        if (first) return first;
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) return realIp;
    return 'unknown';
}

/**
 * Convenience helper for API route handlers. If the request is over
 * the limit, returns a 429 Response; otherwise returns null.
 */
export function applyRateLimit(req: Request, options: RateLimitOptions): Response | null {
    const key = `${options.route}:${getClientKey(req)}`;
    const decision = consumeRateLimit(key, options);
    if (decision.allowed) return null;
    return new Response(
        JSON.stringify({
            error: 'Too many requests. Please slow down and try again shortly.',
            retryAfterSeconds: decision.retryAfterSeconds,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(decision.retryAfterSeconds),
            },
        },
    );
}
