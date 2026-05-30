import { Users, FlaskConical, Scale, Headphones } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type UseCase = {
    icon: LucideIcon;
    audience: string;
    headline: string;
    points: string[];
};

const USE_CASES: UseCase[] = [
    {
        icon: Users,
        audience: 'Product & Strategy',
        headline: 'Keep every decision traceable',
        points: [
            'Track why a decision was made and what changed since',
            'Catch when new data contradicts an old assumption',
        ],
    },
    {
        icon: FlaskConical,
        audience: 'Research & Analysis',
        headline: 'Reason over a body of knowledge',
        points: [
            'Run causal and comparative queries across sources',
            'Trace every claim back to where it came from',
        ],
    },
    {
        icon: Scale,
        audience: 'Operations & Compliance',
        headline: 'A single source of truth that stays true',
        points: [
            'Surface conflicting policies before they ship',
            'See the full history of how a rule evolved',
        ],
    },
    {
        icon: Headphones,
        audience: 'Support & Success',
        headline: 'Answers that are never stale',
        points: [
            'Always reference the most current, non-conflicting answer',
            'Understand the impact of a change across the graph',
        ],
    },
];

export function UseCases() {
    return (
        <section id="use-cases" className="py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold text-violet-400">Use cases</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Built for teams that live and die by what they know
                    </h2>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2">
                    {USE_CASES.map(({ icon: Icon, audience, headline, points }) => (
                        <div
                            key={audience}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-300">
                                    <Icon className="size-5" />
                                </div>
                                <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                                    {audience}
                                </span>
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-white">
                                {headline}
                            </h3>
                            <ul className="mt-4 space-y-2.5">
                                {points.map((p) => (
                                    <li
                                        key={p}
                                        className="flex gap-2.5 text-sm text-white/60"
                                    >
                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-400" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
