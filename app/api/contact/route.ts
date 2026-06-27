import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rateLimit';
import { readJsonBody, describeRouteError } from '@/lib/api-helpers';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(254),
    subject: z.string().min(3).max(160),
    message: z.string().min(10).max(2000),
    honeypot: z.string().optional(),
});

const RATE_LIMIT = { route: 'contact', limit: 5, windowMs: 60_000 };

/**
 * POST /api/contact
 *
 * Lightweight contact-form handler. The current deployment has no live
 * email provider, so this route intentionally returns 503 — the client
 * treats 503/4xx as the cue to fall back to a `mailto:` link.
 *
 * When a provider is wired in the future, drop the 503 response and replace
 * it with a real send — the shape of the request is already validated.
 */
export async function POST(req: Request) {
    const limited = applyRateLimit(req, RATE_LIMIT);
    if (limited) return limited;

    const parsed = await readJsonBody<Record<string, unknown>>(req, 'contact');
    if (!parsed.ok) return parsed.response;

    const result = schema.safeParse(parsed.data);
    if (!result.success) {
        return NextResponse.json(
            { error: 'Validation failed', issues: result.error.flatten() },
            { status: 400 },
        );
    }

    if (result.data.honeypot) {
        // Silently accept — looks like a real send to the bot, real users
        // never fill this hidden field.
        return NextResponse.json({ ok: true });
    }

    try {
        return NextResponse.json(
            {
                error: 'Contact form is not wired to a backend in this build.',
                fallback: 'mailto:dhineshponnarasan@gmail.com',
            },
            { status: 503 },
        );
    } catch (error) {
        const { code, status } = describeRouteError('contact', error);
        return NextResponse.json({ error: 'Unhandled error', code }, { status: status ?? 500 });
    }
}
