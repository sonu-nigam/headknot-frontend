import { Subscription } from '@/pages/Billing/Subscription';
import { Usage } from '@/pages/Billing/Usage';
import { Plans } from '@/pages/Billing/Plans';

export function BillingSection() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Billing & Usage
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your subscription and monitor usage.
                </p>
            </div>
            <Subscription />
            <Usage />
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Available plans</h2>
                <Plans />
            </section>
        </>
    );
}
