import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/billing/workspace/{workspaceId}/cancel", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/billing");
        },
    });
}
