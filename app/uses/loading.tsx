export default function Loading() {
    return (
        <div className="container py-24 max-w-3xl">
            <div className="space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-12 w-1/2 bg-white/5 rounded-md" />
                <div className="h-5 w-2/3 bg-white/5 rounded" />
                <div className="mt-10 space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-20 bg-white/5 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}