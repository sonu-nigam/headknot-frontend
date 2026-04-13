import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDeleteGraphEntity() {
    const queryClient = useQueryClient();

    return $api.useMutation("delete", "/entities/{id}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/entities");
            invalidateByPath(queryClient, "get", "/events");
            invalidateByPath(queryClient, "get", "/query/graph");
        },
    });
}
