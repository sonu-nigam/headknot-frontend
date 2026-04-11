import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCreateGraphEntity() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/graph/entities", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/graph");
        },
    });
}
