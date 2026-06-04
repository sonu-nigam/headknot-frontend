import { $api } from '@workspace/api-client';

/**
 * Verifies a Razorpay payment signature server-side and activates the plan on success. Used by
 * {@link useRazorpayCheckout} from the Checkout success handler.
 */
export function useVerifyPayment() {
    return $api.useMutation(
        'post',
        '/billing/workspace/{workspaceId}/verify-payment',
    );
}
