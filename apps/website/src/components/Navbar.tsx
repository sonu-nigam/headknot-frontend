import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Logo } from './Logo';

// Section links are absolute (/#…) so they jump back to the landing page and
// scroll, even when clicked from another route like /terms or /support.
const LINKS = [
    { label: 'Product', href: '/#product' },
    { label: 'Features', href: '/#features' },
    { label: 'Integrations', href: '/#integrations' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
];

const APP_URL = 'https://app.headknot.com';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled
                    ? 'border-b border-white/10 bg-[#0b0b16]/80 backdrop-blur-xl'
                    : 'border-b border-transparent'
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <a href="/" aria-label="Headknot home">
                    <Logo />
                </a>

                <div className="hidden items-center gap-8 md:flex">
                    {LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm text-white/70 transition-colors hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <a
                        href={`${APP_URL}/login`}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                        Sign in
                    </a>
                    <Button
                        asChild
                        className="bg-violet-600 text-white hover:bg-violet-500"
                    >
                        <a href={`${APP_URL}/signup`}>Get started</a>
                    </Button>
                </div>

                <button
                    type="button"
                    className="text-white md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </nav>

            {open && (
                <div className="border-t border-white/10 bg-[#0b0b16]/95 px-4 py-4 backdrop-blur-xl md:hidden">
                    <div className="flex flex-col gap-1">
                        {LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-3 flex flex-col gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                            >
                                <a href={`${APP_URL}/login`}>Sign in</a>
                            </Button>
                            <Button
                                asChild
                                className="bg-violet-600 text-white hover:bg-violet-500"
                            >
                                <a href={`${APP_URL}/signup`}>Get started</a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
