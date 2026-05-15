import { toast } from 'sonner';
import { $api } from '@workspace/api-client';

export function useCreateCheckoutSession() {
    return $api.useMutation(
        'post',
        '/billing/workspace/{workspaceId}/checkout',
        {
            onSuccess: (data) => {
                if (data?.url) {
                    window.location.href = data.url;
                }
            },
            onError: (e: Error) => {
                toast.error("Couldn't start checkout: " + e.message);
            },
        },
    );
}
