import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useSubscribeWorkspace() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/billing/workspace/{workspaceId}/subscribe", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/billing");
        },
    });
}
