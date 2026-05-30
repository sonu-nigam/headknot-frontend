import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LogoCloud } from './components/LogoCloud';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export default function App() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <LogoCloud />
                <Features />
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
