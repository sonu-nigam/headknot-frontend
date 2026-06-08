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

export function Landing() {
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
