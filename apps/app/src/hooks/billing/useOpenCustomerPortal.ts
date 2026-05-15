import { toast } from 'sonner';
import { $api } from '@workspace/api-client';

export function useOpenCustomerPortal() {
    return $api.useMutation(
        'post',
        '/billing/workspace/{workspaceId}/portal',
        {
            onSuccess: (data) => {
                if (data?.url) {
                    window.location.href = data.url;
                }
            },
            onError: (e: Error) => {
                toast.error("Couldn't open billing portal: " + e.message);
            },
        },
    );
}
