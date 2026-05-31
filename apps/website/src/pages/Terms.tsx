import { PageLayout } from '../components/PageLayout';

const LAST_UPDATED = 'May 31, 2026';
const SUPPORT_EMAIL = 'support@headknot.com';

type Section = {
    id: string;
    heading: string;
    body: string[];
};

const SECTIONS: Section[] = [
    {
        id: 'acceptance',
        heading: 'Acceptance of Terms',
        body: [
            'These Terms & Conditions ("Terms") govern your access to and use of Headknot, including our websites, applications, and related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.',
            'If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization, and "you" refers to that organization.',
        ],
    },
    {
        id: 'eligibility',
        heading: 'Eligibility & Accounts',
        body: [
            'You must be at least 18 years old and capable of forming a binding contract to use the Service. You are responsible for the activity that occurs under your account and for keeping your credentials secure.',
            'You agree to provide accurate account information and to notify us promptly of any unauthorized use of your account.',
        ],
    },
    {
        id: 'billing',
        heading: 'Subscriptions, Billing & Trials',
        body: [
            'Paid plans are billed in advance on a recurring basis (monthly or annually) and are non-refundable except where required by law. Plan limits and pricing are described at the point of purchase and may change with notice.',
            'Free trials, where offered, convert to a paid subscription at the end of the trial period unless cancelled beforehand. You can cancel at any time; access continues until the end of the current billing period.',
        ],
    },
    {
        id: 'acceptable-use',
        heading: 'Acceptable Use',
        body: [
            'You agree not to misuse the Service. This includes, but is not limited to: attempting to gain unauthorized access, interfering with the integrity or performance of the Service, reverse-engineering, scraping at a scale that degrades the Service, or uploading unlawful, infringing, or malicious content.',
            'We may suspend or limit access that we reasonably believe violates these Terms or poses a risk to the Service or other users.',
        ],
    },
    {
        id: 'customer-data',
        heading: 'Customer Data & Privacy',
        body: [
            'You retain all rights to the content and data you connect, upload, or generate through the Service ("Customer Data"). You grant us a limited license to process Customer Data solely to provide and improve the Service.',
            'Our handling of personal data is described in our Privacy Policy. You are responsible for ensuring you have the necessary rights to provide Customer Data to the Service.',
        ],
    },
    {
        id: 'ip',
        heading: 'Intellectual Property',
        body: [
            'The Service, including its software, design, and trademarks, is owned by Headknot and its licensors and is protected by intellectual property laws. These Terms do not grant you any right to our trademarks or branding.',
            'Feedback you provide is voluntary, and we may use it without restriction or obligation to you.',
        ],
    },
    {
        id: 'integrations',
        heading: 'Third-Party Integrations',
        body: [
            'The Service may integrate with third-party tools and services. Your use of those integrations is governed by the respective third party’s terms, and we are not responsible for their availability, accuracy, or practices.',
        ],
    },
    {
        id: 'disclaimers',
        heading: 'Disclaimers',
        body: [
            'The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, secure, or error-free.',
        ],
    },
    {
        id: 'liability',
        heading: 'Limitation of Liability',
        body: [
            'To the maximum extent permitted by law, Headknot will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Service. Our total liability for any claim is limited to the amount you paid us in the twelve months preceding the claim.',
        ],
    },
    {
        id: 'termination',
        heading: 'Termination',
        body: [
            'You may stop using the Service at any time. We may suspend or terminate your access if you breach these Terms or if we discontinue the Service. Upon termination, your right to use the Service ends, and we may delete Customer Data after a reasonable retention period.',
        ],
    },
    {
        id: 'changes',
        heading: 'Changes to These Terms',
        body: [
            'We may update these Terms from time to time. If we make material changes, we will provide notice through the Service or by other reasonable means. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.',
        ],
    },
    {
        id: 'contact',
        heading: 'Contact Us',
        body: [
            `Questions about these Terms? Reach us at ${SUPPORT_EMAIL}.`,
        ],
    },
];

export function Terms() {
    return (
        <PageLayout
            eyebrow="Legal"
            title="Terms & Conditions"
            description={`The agreement that governs your use of Headknot. Last updated ${LAST_UPDATED}.`}
        >
            <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
                {/* On this page */}
                <nav className="lg:sticky lg:top-24 lg:self-start">
                    <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
                        On this page
                    </p>
                    <ul className="mt-4 space-y-2.5">
                        {SECTIONS.map((s, i) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    className="text-sm text-white/55 transition-colors hover:text-white"
                                >
                                    {i + 1}. {s.heading}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sections */}
                <div className="max-w-2xl">
                    {SECTIONS.map((s, i) => (
                        <section
                            key={s.id}
                            id={s.id}
                            className="mb-8 scroll-mt-24 border-b border-white/5 pb-8 last:mb-0 last:border-b-0 last:pb-0"
                        >
                            <h2 className="text-xl font-semibold text-white">
                                {i + 1}. {s.heading}
                            </h2>
                            {s.body.map((p, j) => (
                                <p
                                    key={j}
                                    className="mt-3 text-sm leading-relaxed text-white/65"
                                >
                                    {p}
                                </p>
                            ))}
                        </section>
                    ))}

                    <p className="mt-10 text-xs text-white/40">
                        This page is a template and not legal advice. Replace it
                        with terms reviewed by your counsel before launch.
                    </p>
                </div>
            </div>
        </PageLayout>
    );
}
