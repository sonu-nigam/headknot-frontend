import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ProductShowcase } from '../components/ProductShowcase';
import { Features } from '../components/Features';
import { Integrations } from '../components/Integrations';
import { HowItWorks } from '../components/HowItWorks';
import { UseCases } from '../components/UseCases';
import { Pricing } from '../components/Pricing';
import { FAQ } from '../components/FAQ';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';
import { useSeo } from '../lib/seo';

export function Landing() {
    useSeo({
        title: 'Headknot — Searchable knowledge graph for Slack, Notion & Google Drive',
        description:
            'Headknot turns scattered knowledge across Slack, Notion and Google Drive into a connected, searchable knowledge graph. Discover relationships and search with natural language.',
        path: '/',
    });

    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <ProductShowcase />
                <Features />
                <Integrations />
                <HowItWorks />
                <UseCases />
                <Pricing />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
