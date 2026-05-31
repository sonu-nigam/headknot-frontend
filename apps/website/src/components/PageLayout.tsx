import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Shared chrome for standalone content pages (Terms, Support). The hero glow +
// grid echo the landing page so these pages don't feel disconnected. Top
// padding clears the fixed navbar.
export function PageLayout({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <section className="relative overflow-hidden border-b border-white/5 pt-32 pb-14">
                    <div className="site-glow absolute inset-0 -z-10" />
                    <div className="site-grid absolute inset-0 -z-10 h-[420px]" />
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        {eyebrow && (
                            <p className="text-sm font-semibold text-violet-400">
                                {eyebrow}
                            </p>
                        )}
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-4 max-w-2xl text-lg text-white/60 text-pretty">
                                {description}
                            </p>
                        )}
                    </div>
                </section>

                <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
