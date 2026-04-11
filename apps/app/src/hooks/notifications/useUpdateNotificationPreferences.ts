import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useUpdateNotificationPreferences() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/notifications/preferences", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/notifications");
        },
    });
}
