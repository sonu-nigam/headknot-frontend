import { ArrowRight } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

const APP_URL = 'https://app.headknot.com';

export function CTA() {
    return (
        <section className="px-4 py-24 sm:px-6">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-600/20 to-violet-600/[0.03] px-6 py-16 text-center">
                <div className="site-glow absolute inset-0 -z-10" />
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    Stop searching. Start knowing.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-white/65 text-pretty">
                    Give your team a searchable knowledge graph. Connect your first
                    source in minutes and watch the graph come together.
                </p>
                <div className="mt-9 flex justify-center">
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
                </div>
            </div>
        </section>
    );
}
