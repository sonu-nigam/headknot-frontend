import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useRemoveWorkspaceMember() {
    const queryClient = useQueryClient();

    return $api.useMutation("delete", "/workspaces/{id}/members/{memberId}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/workspaces");
        },
    });
}
