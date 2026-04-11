import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return $api.useMutation("delete", "/notifications/{id}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/notifications");
        },
    });
}
