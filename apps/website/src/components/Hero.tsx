import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { HeroGraph } from './HeroGraph';

const APP_URL = 'https://app.headknot.com';

export function Hero() {
    return (
        <section id="top" className="relative overflow-hidden pt-32 pb-20">
            <div className="site-glow absolute inset-0 -z-10" />
            <div className="site-grid absolute inset-0 -z-10 h-[640px]" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <a
                        href="#features"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-violet-500/40"
                    >
                        <Sparkles className="size-3.5 text-violet-400" />
                        Knowledge Evolution Tracking
                    </a>

                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                        <span className="text-gradient">Your team&apos;s knowledge,</span>
                        <br />
                        alive and evolving.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-white/65 text-pretty">
                        Headknot turns scattered docs, conversations, and decisions
                        into a living knowledge graph — capturing what you know,
                        tracking how it changes, and surfacing conflicts before they
                        cost you.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="bg-violet-600 text-white hover:bg-violet-500"
                        >
                            <a href={`${APP_URL}/signup`}>
                                Start free
                                <ArrowRight className="size-4" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                        >
                            <a href="#how-it-works">See how it works</a>
                        </Button>
                    </div>

                    <p className="mt-4 text-xs text-white/40">
                        Free to start · No credit card required
                    </p>
                </div>

                <div className="relative mx-auto mt-12 max-w-6xl">
                    <HeroGraph className="h-[460px] w-full sm:h-[600px]" />
                </div>
            </div>
        </section>
    );
}
