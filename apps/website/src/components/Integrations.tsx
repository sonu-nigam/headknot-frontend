import { Check, Clock } from 'lucide-react';

const AVAILABLE = ['Slack', 'Google Drive', 'Notion'];

const COMING_SOON = [
    'Confluence',
    'GitHub',
    'Jira',
    'Linear',
    'Microsoft SharePoint',
];

export function Integrations() {
    return (
        <section
            id="integrations"
            className="border-y border-white/5 bg-white/[0.02] py-24"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold text-violet-400">
                        Integrations
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Connect the tools your team already uses
                    </h2>
                </div>

                <div className="mt-16 space-y-12">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                            Available today
                        </p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                            {AVAILABLE.map((name) => (
                                <div
                                    key={name}
                                    className="flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/[0.07] px-5 py-4"
                                >
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                                        <Check className="size-4" />
                                    </span>
                                    <span className="text-base font-semibold text-white">
                                        {name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                            Coming soon
                        </p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {COMING_SOON.map((name) => (
                                <div
                                    key={name}
                                    className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
                                >
                                    <Clock className="size-4 shrink-0 text-white/30" />
                                    <span className="text-sm font-medium text-white/55">
                                        {name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
