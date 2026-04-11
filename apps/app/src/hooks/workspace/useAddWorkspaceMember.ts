import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useAddWorkspaceMember() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/workspaces/{id}/members", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/workspaces");
        },
    });
}
