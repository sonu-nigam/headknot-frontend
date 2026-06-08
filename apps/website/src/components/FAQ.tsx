const FAQS = [
    {
        q: 'What exactly is a knowledge graph?',
        a: 'Instead of storing documents in folders, Headknot stores the concepts inside them — entities like people, products, and decisions — and the relationships between them. That structure is what lets you search by meaning and explore how concepts connect.',
    },
    {
        q: 'What sources can I connect today?',
        a: 'Slack, Google Drive and Notion.',
    },
    {
        q: 'How does Headknot organize information?',
        a: 'Headknot automatically extracts entities and relationships from connected sources and builds a searchable knowledge graph.',
    },
    {
        q: 'Does Headknot use AI?',
        a: 'Yes. Headknot uses AI to extract entities, identify relationships and improve search across connected knowledge.',
    },
    {
        q: 'Do I need to tag or structure anything manually?',
        a: 'No. The extraction engine builds the graph automatically. You can refine and correct entities when you want to, but Headknot does the heavy lifting out of the box.',
    },
    {
        q: 'Is my data secure?',
        a: 'Your knowledge is encrypted in transit and at rest. Enterprise plans add SSO, granular permissions, audit logs, and data-residency options.',
    },
];

export function FAQ() {
    return (
        <section id="faq" className="py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="text-center">
                    <p className="text-sm font-semibold text-violet-400">FAQ</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Questions, answered
                    </h2>
                </div>

                <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
                    {FAQS.map((item) => (
                        <details key={item.q} className="group py-5">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-white">
                                {item.q}
                                <span className="text-violet-400 transition-transform group-open:rotate-45">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M10 4v12M4 10h12"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-white/60">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
