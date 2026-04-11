import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useSyncNotion() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/integrations/notion/{integrationId}/sync", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/integrations");
        },
    });
}
