import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { invalidateByPath } from '@/lib/queryKeys';

// Module-level so StrictMode's double-effect can't fire the toast twice in dev,
// and so a fast back-nav after we redirect won't refire it either.
let toastFiredForVisit = false;

/**
 * Stripe Checkout success landing. Invalidates billing queries, waits briefly for the webhook to
 * land, then redirects back to /billing with a success toast.
 */
export function CheckoutSuccessPage() {
    const queryClient = useQueryClient();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        invalidateByPath(queryClient, 'get', '/billing');

        const t = setTimeout(() => {
            if (!toastFiredForVisit) {
                toastFiredForVisit = true;
                toast.success('Subscription active');
            }
            setReady(true);
        }, 1500);
        return () => clearTimeout(t);
    }, [queryClient]);

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
