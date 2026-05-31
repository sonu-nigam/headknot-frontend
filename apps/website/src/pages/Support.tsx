import {
    Rocket,
    CreditCard,
    Plug,
    ShieldCheck,
    Mail,
    MessageCircle,
    BookOpen,
    ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { PageLayout } from '../components/PageLayout';

const SUPPORT_EMAIL = 'support@headknot.com';
const SALES_EMAIL = 'sales@headknot.com';

type Topic = {
    icon: LucideIcon;
    title: string;
    description: string;
    items: string[];
};

const TOPICS: Topic[] = [
    {
        icon: Rocket,
        title: 'Getting started',
        description: 'Set up your workspace and connect your first source.',
        items: [
            'Create a workspace & invite your team',
            'Connect a source and build the graph',
            'Run your first search',
        ],
    },
    {
        icon: Plug,
        title: 'Integrations',
        description: 'Connect the tools your knowledge already lives in.',
        items: [
            'Available integrations',
            'Re-syncing & connection health',
            'Permissions & scopes',
        ],
    },
    {
        icon: CreditCard,
        title: 'Account & billing',
        description: 'Plans, invoices, seats, and subscription changes.',
        items: [
            'Upgrade, downgrade, or cancel',
            'Update payment details',
            'Manage seats & invoices',
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Security & privacy',
        description: 'How your knowledge is protected and controlled.',
        items: [
            'Data encryption & residency',
            'SSO & access controls',
            'Exporting or deleting data',
        ],
    },
];

type Channel = {
    icon: LucideIcon;
    title: string;
    description: string;
    cta: string;
    href: string;
};

const CHANNELS: Channel[] = [
    {
        icon: Mail,
        title: 'Email support',
        description: 'Get help from our team. We typically reply within a day.',
        cta: 'Email support',
        href: `mailto:${SUPPORT_EMAIL}`,
    },
    {
        icon: MessageCircle,
        title: 'Talk to sales',
        description: 'Questions about Enterprise, security reviews, or pricing.',
        cta: 'Contact sales',
        href: `mailto:${SALES_EMAIL}`,
    },
    {
        icon: BookOpen,
        title: 'Documentation',
        description: 'Guides and references for getting the most out of Headknot.',
        cta: 'Read the docs',
        href: '#',
    },
];

export function Support() {
    return (
        <PageLayout
            eyebrow="Support"
            title="How can we help?"
            description="Browse common topics, read the docs, or reach our team directly — we're here to keep your knowledge flowing."
        >
            {/* Help topics */}
            <div className="grid gap-6 sm:grid-cols-2">
                {TOPICS.map(({ icon: Icon, title, description, items }) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                        <div className="flex size-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                            <Icon className="size-5" />
                        </div>
                        <h2 className="mt-5 text-lg font-semibold text-white">
                            {title}
                        </h2>
                        <p className="mt-1.5 text-sm text-white/60">
                            {description}
                        </p>
                        <ul className="mt-4 space-y-2.5">
                            {items.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-violet-300"
                                    >
                                        <span className="size-1.5 shrink-0 rounded-full bg-violet-400" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Popular questions → landing FAQ */}
            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-lg font-semibold text-white">
                        Looking for quick answers?
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                        Our FAQ covers the questions we hear most often.
                    </p>
                </div>
                <Button
                    asChild
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                >
                    <Link to="/#faq">
                        Read the FAQ
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>

            {/* Contact channels */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                    Still need help?
                </h2>
                <p className="mt-2 text-white/60">
                    Reach our team through any of these channels.
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    {CHANNELS.map(({ icon: Icon, title, description, cta, href }) => (
                        <div
                            key={title}
                            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                        >
                            <div className="flex size-10 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-300">
                                <Icon className="size-5" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-white">
                                {title}
                            </h3>
                            <p className="mt-1.5 flex-1 text-sm text-white/60">
                                {description}
                            </p>
                            <a
                                href={href}
                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300"
                            >
                                {cta}
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
