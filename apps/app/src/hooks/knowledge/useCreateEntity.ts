import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCreateEntity() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/knowledge/entities", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/knowledge/entities");
        },
    });
}
