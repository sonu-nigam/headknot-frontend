import AppLayout from '@/components/AppLayout';
import { Subscription } from './Subscription';
import { Usage } from './Usage';
import { Plans } from './Plans';

export function BillingPage() {
    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Billing' }]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-5xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Billing & Usage
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage your subscription and monitor usage.
                        </p>
                    </div>

                    <Subscription />
                    <Usage />

                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">Available plans</h2>
                        <Plans />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
