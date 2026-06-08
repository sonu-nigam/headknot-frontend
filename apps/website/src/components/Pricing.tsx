import { Check, Minus } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

const APP_URL = 'https://app.headknot.com';

type Plan = {
    name: string;
    price: string;
    cadence?: string;
    description: string;
    inherits?: string;
    features: string[];
    limits?: string[];
    cta: string;
    href: string;
    featured?: boolean;
};

const PLANS: Plan[] = [
    {
        name: 'Free',
        price: '$0',
        cadence: '/month',
        description: 'Perfect for individuals exploring connected knowledge.',
        features: [
            '1 workspace',
            'Slack, Google Drive, or Notion connection',
            'Up to 100,000 words indexed',
            'Knowledge graph generation',
            'Entity & relationship extraction',
            'Natural language search',
            'Basic graph exploration',
        ],
        limits: [
            '1 connector active at a time',
            'No priority processing',
            'Community support',
        ],
        cta: 'Get started free',
        href: `${APP_URL}/signup`,
    },
    {
        name: 'Pro',
        price: '$9',
        cadence: '/month',
        description:
            'For professionals and small teams building a shared knowledge base.',
        inherits: 'Everything in Free, plus:',
        features: [
            'Up to 3 connectors',
            'Slack + Google Drive + Notion together',
            'Up to 5 million words indexed',
            'Unlimited graph exploration',
            'Faster indexing',
            'Advanced search capabilities',
            'Email support',
        ],
        cta: 'Start 7-day free trial',
        href: `${APP_URL}/signup?plan=pro`,
        featured: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For organizations managing large-scale knowledge.',
        inherits: 'Everything in Pro, plus:',
        features: [
            'Custom ingestion limits',
            'Dedicated support',
            'Priority indexing',
            'SSO (coming soon)',
            'Advanced permissions (coming soon)',
            'Custom integrations',
            'SLA support',
        ],
        cta: 'Contact sales',
        href: 'mailto:sales@headknot.com',
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="border-y border-white/5 bg-white/[0.02] py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold text-violet-400">Pricing</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Simple pricing that scales with your knowledge
                    </h2>
                </div>

                <div className="mt-16 grid items-start gap-6 lg:grid-cols-3">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl border p-7 ${
                                plan.featured
                                    ? 'border-violet-500/50 bg-violet-500/[0.07] shadow-[0_0_40px_-12px_rgba(124,58,237,0.5)]'
                                    : 'border-white/10 bg-white/[0.03]'
                            }`}
                        >
                            {plan.featured && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                                    Most popular
                                </span>
                            )}
                            <h3 className="text-lg font-semibold text-white">
                                {plan.name}
                            </h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">
                                    {plan.price}
                                </span>
                                {plan.cadence && (
                                    <span className="text-sm text-white/50">
                                        {plan.cadence}
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-sm text-white/60">
                                {plan.description}
                            </p>

                            <Button
                                asChild
                                className={`mt-6 w-full ${
                                    plan.featured
                                        ? 'bg-violet-600 text-white hover:bg-violet-500'
                                        : 'bg-white/10 text-white hover:bg-white/15'
                                }`}
                            >
                                <a href={plan.href}>{plan.cta}</a>
                            </Button>

                            {plan.inherits && (
                                <p className="mt-7 text-sm font-medium text-white/80">
                                    {plan.inherits}
                                </p>
                            )}

                            <ul
                                className={`space-y-3 ${plan.inherits ? 'mt-4' : 'mt-7'}`}
                            >
                                {plan.features.map((f) => (
                                    <li
                                        key={f}
                                        className="flex gap-3 text-sm text-white/70"
                                    >
                                        <Check className="mt-0.5 size-4 shrink-0 text-violet-400" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {plan.limits && (
                                <>
                                    <p className="mt-6 text-xs font-semibold tracking-widest text-white/40 uppercase">
                                        Limits
                                    </p>
                                    <ul className="mt-4 space-y-3">
                                        {plan.limits.map((l) => (
                                            <li
                                                key={l}
                                                className="flex gap-3 text-sm text-white/45"
                                            >
                                                <Minus className="mt-0.5 size-4 shrink-0 text-white/30" />
                                                {l}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
