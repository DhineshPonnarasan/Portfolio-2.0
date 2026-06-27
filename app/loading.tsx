export default function Loading() {
    return (
        <div className="container py-20">
            <div className="space-y-8 animate-pulse" aria-live="polite" aria-busy="true">
                <div className="h-12 w-2/3 bg-white/5 rounded-md" />
                <div className="h-6 w-1/2 bg-white/5 rounded-md" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-40 bg-white/5 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
