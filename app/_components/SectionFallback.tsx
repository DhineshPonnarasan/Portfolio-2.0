/**
 * Lightweight fallback used while dynamic home-page sections hydrate.
 * Matches the look-and-feel of the global loading skeleton.
 */
export function SectionFallback() {
    return (
        <div
            className="container py-16"
            aria-hidden="true"
            role="presentation"
        >
            <div className="space-y-4 animate-pulse">
                <div className="h-6 w-1/3 bg-white/5 rounded-md" />
                <div className="h-4 w-2/3 bg-white/5 rounded-md" />
                <div className="h-32 w-full bg-white/5 rounded-xl" />
            </div>
        </div>
    );
}

export default SectionFallback;