import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCreateGraphEvent() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/events", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/entities");
            invalidateByPath(queryClient, "get", "/events");
            invalidateByPath(queryClient, "get", "/query/graph");
        },
    });
}
