import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invalidateByPath } from '@/lib/queryKeys';
import { loadRazorpayScript } from './useRazorpayScript';
import { useCreateOrder } from './useCreateOrder';
import { useVerifyPayment } from './useVerifyPayment';

interface StartCheckoutArgs {
    workspaceId: string;
    priceLookupKey: string;
}

/**
 * Drives the full Razorpay Standard Checkout flow: create order → open the in-page modal → verify
 * the payment signature → activate the plan. Replaces the old hosted-redirect checkout.
 *
 * On verified success it invalidates billing queries and calls {@code options.onSuccess}. Modal
 * dismissal and `payment.failed` surface as toasts.
 */
export function useRazorpayCheckout(options?: { onSuccess?: () => void }) {
    const queryClient = useQueryClient();
    const createOrder = useCreateOrder();
    const verifyPayment = useVerifyPayment();
    const [isOpening, setIsOpening] = useState(false);

    const startCheckout = useCallback(
        async ({ workspaceId, priceLookupKey }: StartCheckoutArgs) => {
            setIsOpening(true);
            try {
                const order = await createOrder.mutateAsync({
                    params: { path: { workspaceId } },
                    body: { priceLookupKey },
                });

                await loadRazorpayScript();
                if (!window.Razorpay) {
                    throw new Error('Razorpay checkout is unavailable');
                }

                const rzp = new window.Razorpay({
                    key: order.keyId,
                    order_id: order.orderId,
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Headknot',
                    description: `${order.planName} (${order.cycle})`,
                    handler: async (response) => {
                        try {
                            await verifyPayment.mutateAsync({
                                params: { path: { workspaceId } },
                                body: {
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId:
                                        response.razorpay_payment_id,
                                    razorpaySignature:
                                        response.razorpay_signature,
                                },
                            });
                            invalidateByPath(queryClient, 'get', '/billing');
                            toast.success('Subscription active');
                            options?.onSuccess?.();
                        } catch (e) {
                            toast.error(
                                "Payment couldn't be verified: " +
                                    (e as Error).message,
                            );
                        } finally {
                            setIsOpening(false);
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setIsOpening(false);
                            toast.message('Payment cancelled');
                        },
                    },
                });

                rzp.on('payment.failed', (resp) => {
                    setIsOpening(false);
                    toast.error(
                        'Payment failed: ' +
                            (resp?.error?.description ?? 'unknown error'),
                    );
                });

                rzp.open();
            } catch (e) {
                setIsOpening(false);
                toast.error("Couldn't start checkout: " + (e as Error).message);
            }
        },
        [createOrder, verifyPayment, queryClient, options],
    );

    const isPending =
        isOpening || createOrder.isPending || verifyPayment.isPending;

    return { startCheckout, isPending };
}
