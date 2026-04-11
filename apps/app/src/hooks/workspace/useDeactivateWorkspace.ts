import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDeactivateWorkspace() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/workspaces/{id}/deactivate", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/workspaces");
        },
    });
}
