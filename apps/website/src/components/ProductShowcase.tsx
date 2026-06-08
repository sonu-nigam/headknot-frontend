import { useState } from 'react';
import { Network, Search, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Shot = {
    icon: LucideIcon;
    title: string;
    blurb: string;
    // Drop the real screenshot at apps/website/public/screenshots/<file>.
    // Until it exists, a branded placeholder renders in its place.
    src: string;
};

const SHOTS: Shot[] = [
    {
        icon: Network,
        title: 'Knowledge graph',
        blurb: 'See people, projects, documents and decisions as one connected graph.',
        src: '/screenshots/knowledge-graph.png',
    },
    {
        icon: Search,
        title: 'Search results',
        blurb: 'Ask in natural language and surface the most relevant knowledge.',
        src: '/screenshots/search-results.png',
    },
    {
        icon: FileText,
        title: 'Entity details',
        blurb: 'Open any entity to see its sources and related connections.',
        src: '/screenshots/entity-details.png',
    },
];

function ScreenshotFrame({ icon: Icon, title, src }: Shot) {
    const [failed, setFailed] = useState(false);

    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b16]">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
            </div>

            <div className="relative aspect-[16/10]">
                {!failed ? (
                    <img
                        src={src}
                        alt={`${title} — Headknot product screenshot`}
                        loading="lazy"
                        onError={() => setFailed(true)}
                        className="size-full object-cover object-top"
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-violet-500/[0.07] to-transparent">
                        <span className="flex size-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                            <Icon className="size-6" />
                        </span>
                        <span className="text-sm font-medium text-white/40">
                            {title}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ProductShowcase() {
    return (
        <section id="product" className="py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold text-violet-400">
                        Product
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        A product you can use today
                    </h2>
                    <p className="mt-4 text-lg text-white/60 text-pretty">
                        Connect a source and explore your knowledge graph, search,
                        and entity details in minutes.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 lg:grid-cols-3">
                    {SHOTS.map((shot) => (
                        <div key={shot.title}>
                            <ScreenshotFrame {...shot} />
                            <h3 className="mt-5 text-base font-semibold text-white">
                                {shot.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                                {shot.blurb}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
