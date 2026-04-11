import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDeleteGraphEvent() {
    const queryClient = useQueryClient();

    return $api.useMutation("delete", "/graph/events/{id}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/graph");
        },
    });
}
