import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return $api.useMutation('post', '/billing/workspace/{workspaceId}/cancel', {
        onSuccess: () => {
            invalidateByPath(queryClient, 'get', '/billing');
            toast.success('Subscription will end at period end');
        },
        onError: (e: Error) => {
            toast.error("Couldn't cancel subscription: " + e.message);
        },
    });
}
