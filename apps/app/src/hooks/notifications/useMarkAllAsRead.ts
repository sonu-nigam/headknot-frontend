import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/notifications/read-all", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/notifications");
        },
    });
}
