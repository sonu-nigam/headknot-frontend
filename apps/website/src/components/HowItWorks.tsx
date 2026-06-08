const STEPS = [
    {
        step: '01',
        title: 'Connect your sources',
        description:
            'Connect Slack, Google Drive, and Notion. Headknot ingests your knowledge automatically — no manual tagging or upkeep.',
    },
    {
        step: '02',
        title: 'Headknot builds the graph',
        description:
            'The extraction engine pulls out entities and relationships, then links them into a single connected knowledge graph.',
    },
    {
        step: '03',
        title: 'Search, explore & discover',
        description:
            'Explore connected knowledge through natural language search and relationship discovery.',
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="border-y border-white/5 bg-white/[0.02] py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold text-violet-400">
                        How it works
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        From scattered to connected in three steps
                    </h2>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {STEPS.map((s, i) => (
                        <div key={s.step} className="relative">
                            {i < STEPS.length - 1 && (
                                <div className="absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-violet-500/40 to-transparent md:block" />
                            )}
                            <div className="flex size-12 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-sm font-semibold text-violet-300">
                                {s.step}
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-white">
                                {s.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/60">
                                {s.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
