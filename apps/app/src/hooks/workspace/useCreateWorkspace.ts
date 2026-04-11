import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCreateWorkspace() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/workspaces", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/workspaces");
        },
    });
}
