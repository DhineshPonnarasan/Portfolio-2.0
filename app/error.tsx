'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
            <h1 className="text-4xl font-anton text-primary">500</h1>
            <p className="text-xl text-white/70">Something went wrong</p>
            {process.env.NODE_ENV === 'development' && (
                <p className="text-sm text-white/40 font-mono max-w-md break-all">{error.message}</p>
            )}
            <button
                onClick={reset}
                className="px-6 py-2 border border-primary/50 text-primary hover:bg-primary/10 transition-colors rounded-md text-sm"
            >
                Try again
            </button>
        </div>
    );
}
