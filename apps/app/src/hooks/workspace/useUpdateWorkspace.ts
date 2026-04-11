import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/workspaces/{id}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/workspaces");
        },
    });
}
