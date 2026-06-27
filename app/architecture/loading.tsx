export default function Loading() {
    return (
        <div className="container py-24 max-w-4xl">
            <div className="space-y-6 animate-pulse" aria-live="polite" aria-busy="true">
                <div className="h-10 w-1/2 bg-white/5 rounded-md" />
                <div className="h-6 w-3/4 bg-white/5 rounded-md" />
                <div className="grid gap-6 md:grid-cols-2 mt-10">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white/5 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
