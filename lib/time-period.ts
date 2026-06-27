/**
 * Tiny time-period normalisation helper.
 *
 * Accepts the various period-string shapes used throughout `lib/data.ts`:
 *   - `"May 2026 – Present"`
 *   - `"Jan 2026 – Mar 2026"`
 *   - `"Apr 2026 – Present"`
 * and emits a single canonical form with:
 *   - a non-breaking space before the month
 *   - an en-dash (–, U+2013) — not a hyphen — between the two halves
 *   - the `Present` token capitalised
 *
 * Behaviour:
 *   - "now" / "current" / "today"  →  "Present"
 *   - lowercase "present"           →  "Present"
 *   - hyphen `-` or em-dash `—`     →  en-dash `–`
 *   - double spaces collapsed to single spaces
 */
const DASH_RE = /\s*[–—\-]\s*/g;
const TRIM_RE = /\s+/g;

export function formatPeriod(input: string | null | undefined): string {
    if (!input) return '';
    const replaced = String(input)
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(DASH_RE, ' \u2013 ')
        .replace(/\bnow\b|\bcurrent\b|\btoday\b/gi, 'Present')
        .replace(/\bpresent\b/g, 'Present')
        .replace(TRIM_RE, ' ')
        .trim();
    return replaced;
}

/**
 * Convert "Jan 2026" → { year: 2026, month: 1 }. Returns null on failure.
 * Used by callers that want to do start-date ordering without dragging in
 * a date library.
 */
const MONTHS: Record<string, number> = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

export function parsePeriodStart(input: string | null | undefined): { year: number; month: number } | null {
    if (!input) return null;
    const m = String(input).match(/([A-Za-z]+)\s+(\d{4})/);
    if (!m) return null;
    const month = MONTHS[m[1].toLowerCase().slice(0, 3)] ?? null;
    const year = Number.parseInt(m[2], 10);
    if (month === null || !Number.isFinite(year)) return null;
    return { year, month };
}
