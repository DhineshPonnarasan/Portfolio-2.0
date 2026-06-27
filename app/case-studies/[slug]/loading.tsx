export default function Loading() {
    return (
        <div className="container py-24 max-w-3xl">
            <div className="space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                <div className="h-3 w-24 bg-white/5 rounded" />
                <div className="h-12 w-2/3 bg-white/5 rounded-md" />
                <div className="h-5 w-3/4 bg-white/5 rounded" />
                <div className="h-20 w-full bg-white/5 rounded-2xl mt-6" />
                <div className="space-y-3 mt-10">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-4 w-full bg-white/5 rounded" />
                    ))}
                </div>
            </div>
        </div>
    );
}