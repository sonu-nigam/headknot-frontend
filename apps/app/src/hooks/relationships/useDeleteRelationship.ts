import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDeleteRelationship() {
    const queryClient = useQueryClient();

    return $api.useMutation("delete", "/relationships/{relationshipId}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/relationships");
        },
    });
}
