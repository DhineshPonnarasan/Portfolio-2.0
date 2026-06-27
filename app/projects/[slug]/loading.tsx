export default function Loading() {
    return (
        <div className="container py-20 max-w-4xl">
            <div className="space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                <div className="h-10 w-3/4 bg-white/5 rounded-md" />
                <div className="h-6 w-1/2 bg-white/5 rounded-md" />
                <div className="h-6 w-1/3 bg-white/5 rounded-md" />
                <div className="space-y-3 mt-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 w-full bg-white/5 rounded-md" />
                    ))}
                </div>
            </div>
        </div>
    );
}
