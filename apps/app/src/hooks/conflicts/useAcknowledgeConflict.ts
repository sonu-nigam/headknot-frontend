import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useAcknowledgeConflict() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/conflicts/{id}/acknowledge", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/conflicts");
            invalidateByPath(queryClient, "get", "/timeline");
        },
    });
}
