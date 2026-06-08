import { GitBranch, Search, Boxes, Plug } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const FEATURES: Feature[] = [
    {
        icon: GitBranch,
        title: 'Linked knowledge graph',
        description:
            'Entities and the relationships between them are extracted automatically and woven into one connected, queryable graph.',
    },
    {
        icon: Boxes,
        title: 'Extraction engine',
        description:
            'Turn unstructured docs and conversations into structured entities and relationships you can trace back to the source.',
    },
    {
        icon: Search,
        title: 'Semantic knowledge search',
        description:
            'Search across connected knowledge using natural language and discover relevant information beyond keyword matching.',
    },
    {
        icon: Plug,
        title: 'Integrations',
        description:
            'Connect Slack, Google Drive and Notion to unify organizational knowledge.',
    },
];

export function Features() {
    return (
        <section id="features" className="py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold text-violet-400">
                        Everything in one graph
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Not another doc dump. A connected knowledge graph.
                    </h2>
                    <p className="mt-4 text-lg text-white/60 text-pretty">
                        Most tools just store what you write. Headknot extracts the
                        entities and relationships inside it, so you can search and
                        explore your knowledge by meaning.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-violet-500/40 hover:bg-white/[0.05]"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                                <Icon className="size-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-white">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/60">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
