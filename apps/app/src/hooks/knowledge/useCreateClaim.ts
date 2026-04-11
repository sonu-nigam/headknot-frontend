import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCreateClaim() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/knowledge/claims", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/knowledge/claims");
        },
    });
}
