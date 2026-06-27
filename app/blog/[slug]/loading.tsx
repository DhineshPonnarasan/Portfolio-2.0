export default function Loading() {
    return (
        <div className="container py-24 max-w-3xl">
            <div className="space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                <div className="h-3 w-20 bg-white/5 rounded" />
                <div className="h-10 w-3/4 bg-white/5 rounded-md" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
                <div className="space-y-3 mt-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-4 w-full bg-white/5 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}