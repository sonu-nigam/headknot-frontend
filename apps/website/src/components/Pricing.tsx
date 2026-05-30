import { Check } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

const APP_URL = 'https://app.headknot.com';

type Plan = {
    name: string;
    price: string;
    cadence?: string;
    description: string;
    features: string[];
    cta: string;
    href: string;
    featured?: boolean;
};

const PLANS: Plan[] = [
    {
        name: 'Free',
        price: '$0',
        cadence: '/mo',
        description: 'For individuals organizing their own knowledge.',
        features: [
            'Up to 1,000 entities',
            '1 connected source',
            'Knowledge graph & search',
            'Community support',
        ],
        cta: 'Start free',
        href: `${APP_URL}/signup`,
    },
    {
        name: 'Team',
        price: '$24',
        cadence: '/user / mo',
        description: 'For teams building a shared, living knowledge base.',
        features: [
            'Unlimited entities',
            'All integrations',
            'Evolution tracking & conflict detection',
            'Deep reasoning queries',
            'Priority support',
        ],
        cta: 'Start free trial',
        href: `${APP_URL}/signup?plan=team`,
        featured: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For organizations with scale, security, and SSO needs.',
        features: [
            'Everything in Team',
            'SSO & advanced permissions',
            'Audit logs & data residency',
            'Dedicated success manager',
            'SLA & onboarding',
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

                            <ul className="mt-7 space-y-3">
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
