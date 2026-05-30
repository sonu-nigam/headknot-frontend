import {
    GitBranch,
    History,
    AlertTriangle,
    Search,
    Boxes,
    Plug,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const FEATURES: Feature[] = [
    {
        icon: GitBranch,
        title: 'Living knowledge graph',
        description:
            'Entities and the relationships between them are extracted automatically and woven into one connected, queryable graph.',
    },
    {
        icon: History,
        title: 'Evolution tracking',
        description:
            'See how a fact, decision, or definition changed over time — who changed it, when, and why it matters now.',
    },
    {
        icon: AlertTriangle,
        title: 'Conflict detection',
        description:
            'Headknot flags contradictions between sources the moment they appear, so stale or competing answers never slip through.',
    },
    {
        icon: Search,
        title: 'Deep search & reasoning',
        description:
            'Go beyond keywords with causal, procedural, comparative, and impact-analysis queries across everything you know.',
    },
    {
        icon: Boxes,
        title: 'Extraction engine',
        description:
            'Turn unstructured docs and conversations into structured, verifiable claims you can trust and trace back to the source.',
    },
    {
        icon: Plug,
        title: 'Integrations',
        description:
            'Connect the tools your team already uses. Knowledge flows in continuously and stays in sync as things change.',
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
                        Not another doc dump. A system that understands.
                    </h2>
                    <p className="mt-4 text-lg text-white/60 text-pretty">
                        Most tools store what you write. Headknot understands what it
                        means, how it connects, and how it changes.
                    </p>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
