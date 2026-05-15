import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { invalidateByPath } from '@/lib/queryKeys';
import { useTrialStatus } from '@/hooks/billing/useTrialStatus';
import { format } from 'date-fns';

// Module-level so StrictMode's double-effect can't fire the toast twice in dev,
// and so a fast back-nav after we redirect won't refire it either.
let toastFiredForVisit = false;

/**
 * Stripe Checkout success landing. Invalidates the billing queries (subscription/limits/trial),
 * waits briefly for the webhook to land, then redirects back to /billing with a toast that
 * differentiates "trial started" vs "subscription active" based on whether the user's trial just
 * flipped to used during this flow.
 */
export function CheckoutSuccessPage() {
    const queryClient = useQueryClient();
    const [ready, setReady] = useState(false);
    const { refetch: refetchTrialStatus } = useTrialStatus();

    useEffect(() => {
        // Webhook may still be propagating; invalidate everything billing-shaped and pull fresh
        // trial status to decide which toast copy to fire.
        invalidateByPath(queryClient, 'get', '/billing');

        let cancelled = false;
        const t = setTimeout(async () => {
            try {
                const { data: latest } = await refetchTrialStatus();
                if (cancelled) return;
                if (!toastFiredForVisit) {
                    toastFiredForVisit = true;
                    const usedAt = latest?.trialUsedAt
                        ? new Date(latest.trialUsedAt)
                        : null;
                    const justStartedTrial =
                        latest?.trialUsed &&
                        usedAt &&
                        Date.now() - usedAt.getTime() < 2 * 60 * 1000;

                    if (justStartedTrial && usedAt) {
                        const billsOn = new Date(
                            usedAt.getTime() + 7 * 24 * 60 * 60 * 1000,
                        );
                        toast.success(
                            `7-day trial started — card on file will be billed on ${format(billsOn, 'MMM d, yyyy')}.`,
                        );
                    } else {
                        toast.success('Subscription active');
                    }
                }
            } finally {
                if (!cancelled) setReady(true);
            }
        }, 1500);
        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [queryClient, refetchTrialStatus]);

    if (ready) {
        return <Navigate to="/billing" replace />;
    }

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Billing', href: '/billing' },
                { label: 'Success' },
            ]}
        >
            <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                    Syncing your subscription...
                </div>
            </div>
        </AppLayout>
    );
}
