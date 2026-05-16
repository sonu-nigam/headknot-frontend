import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useSelectFreePlan() {
    const queryClient = useQueryClient();
    return $api.useMutation(
        'post',
        '/billing/workspace/{workspaceId}/select-free-plan',
        {
            onSuccess: () => {
                invalidateByPath(queryClient, 'get', '/billing');
                toast.success('Free plan activated');
            },
            onError: (e: Error) => {
                toast.error("Couldn't activate Free plan: " + e.message);
            },
        },
    );
}
