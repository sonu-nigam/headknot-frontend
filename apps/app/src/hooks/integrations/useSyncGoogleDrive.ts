import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useSyncGoogleDrive() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/integrations/google-drive/{integrationId}/sync", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/integrations");
        },
    });
}
