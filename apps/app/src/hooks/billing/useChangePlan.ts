import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useChangePlan() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/billing/workspace/{workspaceId}/plan", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/billing");
        },
    });
}
