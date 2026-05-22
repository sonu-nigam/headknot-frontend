import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useResolveConflict() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/conflicts/{id}/resolve", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/conflicts");
        },
    });
}
