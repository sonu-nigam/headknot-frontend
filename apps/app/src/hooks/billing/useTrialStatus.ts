import { $api } from '@workspace/api-client';

/**
 * User-scoped (not workspace-scoped) — whether the authenticated user has consumed their one-time
 * 7-day trial. Backs the Plans.tsx CTA copy, the Plans.tsx "Recommended" ribbon on Pro, the
 * BillingBanner "Welcome — start your trial" state, and the CheckoutSuccessPage trial-vs-paid
 * toast.
 */
export function useTrialStatus() {
    return $api.useQuery('get', '/billing/me/trial-status', undefined, {
        staleTime: 60_000,
    });
}
