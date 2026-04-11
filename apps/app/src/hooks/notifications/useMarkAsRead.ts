import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/notifications/{id}/read", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/notifications");
        },
    });
}
