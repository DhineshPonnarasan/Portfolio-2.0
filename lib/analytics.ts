type GtagFn = (
    _command: 'event' | 'set' | 'config',
    _eventName: string,
    _params?: Record<string, unknown>,
) => void;

declare global {
    interface Window {
        gtag?: GtagFn;
    }
}

/**
 * Light GA4 wrapper. No-ops on the server, swallows errors so analytics can
 * never break user-facing UX. Replace the loose typing later if GA
 * publishes a real `@types/gtag.js`.
 */
export function trackEvent(event: string, params?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    const gtag = window.gtag;
    if (typeof gtag !== 'function') return;
    try {
        gtag('event', event, params);
    } catch {
        // Swallow analytics errors to avoid impacting UX
    }
}
