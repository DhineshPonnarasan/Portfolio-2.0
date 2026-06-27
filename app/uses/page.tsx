import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { USES } from '@/lib/uses';
import UsesIcon from './_components/UsesIcon';

export const metadata: Metadata = {
    title: 'Uses',
    description:
        'Hardware, software, and services that power Dhinesh Ponnarasan\'s day-to-day workflow as an AI/ML engineer.',
    alternates: { canonical: `${SITE_URL}/uses` },
};

export default function UsesPage() {
    return (
        <main className="pt-24 pb-16 min-h-screen">
            <div className="container mx-auto px-4">
                <section className="max-w-3xl mx-auto mb-12 space-y-4">
                    <p className="text-[0.7rem] tracking-[0.4em] uppercase text-muted-foreground/70">
                        /uses
                    </p>
                    <h1 className="text-3xl md:text-4xl font-anton bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        What I use to ship
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
                        A living list of the editor, terminal, hardware, and services that
                        power my day-to-day. Lazy-loaded SVG icons from{' '}
                        <a
                            href="https://simpleicons.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Simple Icons
                        </a>{' '}
                        keep this page\'s payload tiny — only the icons that scroll
                        into view are fetched.
                    </p>
                </section>

                <div className="max-w-3xl mx-auto space-y-12">
                    {USES.map((group) => (
                        <section key={group.category}>
                            <h2 className="text-xl font-anton uppercase tracking-wider text-white/80 mb-4">
                                {group.category}
                            </h2>
                            <ul className="space-y-3">
                                {group.items.map((item) => (
                                    <li
                                        key={item.name}
                                        className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.05]"
                                    >
                                        <div className="flex items-start gap-4">
                                            <UsesIcon slug={item.icon} name={item.name} />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-white">
                                                    {item.link ? (
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-primary transition-colors"
                                                        >
                                                            {item.name}
                                                        </a>
                                                    ) : (
                                                        item.name
                                                    )}
                                                </h3>
                                                <p className="mt-1 text-sm text-white/70 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}
