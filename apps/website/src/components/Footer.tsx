import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const APP_URL = 'https://app.headknot.com';

type FooterLink = { label: string; href: string; route?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '/#features' },
            { label: 'How it works', href: '/#how-it-works' },
            { label: 'Use cases', href: '/#use-cases' },
            { label: 'Pricing', href: '/#pricing' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Contact', href: 'mailto:hello@headknot.com' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Documentation', href: '#' },
            { label: 'Changelog', href: '#' },
            { label: 'Status', href: '#' },
            { label: 'Support', href: '/support', route: true },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '/terms', route: true },
            { label: 'Security', href: '#' },
        ],
    },
];

const LINK_CLASS =
    'text-sm text-white/55 transition-colors hover:text-white';

export function Footer() {
    return (
        <footer className="border-t border-white/10 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
                    <div>
                        <Logo />
                        <p className="mt-4 max-w-xs text-sm text-white/50">
                            Knowledge Evolution Tracking. Turn what your team knows
                            into a living, connected graph.
                        </p>
                        <a
                            href={`${APP_URL}/signup`}
                            className="mt-5 inline-block text-sm font-medium text-violet-400 hover:text-violet-300"
                        >
                            Get started free →
                        </a>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-sm font-semibold text-white">
                                {col.title}
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.route ? (
                                            <Link
                                                to={link.href}
                                                className={LINK_CLASS}
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className={LINK_CLASS}
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-xs text-white/40">
                        © {2026} Headknot. All rights reserved.
                    </p>
                    <p className="text-xs text-white/40">
                        Built for teams that live by what they know.
                    </p>
                </div>
            </div>
        </footer>
    );
}
