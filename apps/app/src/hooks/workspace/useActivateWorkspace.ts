import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useActivateWorkspace() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/workspaces/{id}/activate", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/workspaces");
        },
    });
}
