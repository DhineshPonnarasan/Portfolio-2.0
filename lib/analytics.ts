export function trackEvent(event: string, params?: Record<string, any>) {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;
    try {
        gtag('event', event, params || {});
    } catch {
        // Swallow analytics errors to avoid impacting UX
    }
}


