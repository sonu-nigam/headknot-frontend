import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCreateRelationship() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/relationships", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/relationships");
        },
    });
}
