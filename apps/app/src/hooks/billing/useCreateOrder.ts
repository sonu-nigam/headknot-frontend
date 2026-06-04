import { $api } from '@workspace/api-client';

/**
 * Creates a Razorpay order for a plan + cycle. Returns the order plus the publishable key id the
 * frontend uses to open the Checkout modal. Used by {@link useRazorpayCheckout}.
 */
export function useCreateOrder() {
    return $api.useMutation('post', '/billing/workspace/{workspaceId}/order');
}
