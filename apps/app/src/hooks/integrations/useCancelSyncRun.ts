import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useCancelSyncRun() {
    const queryClient = useQueryClient();

    return $api.useMutation('post', '/integrations/{id}/sync-runs/{runId}/cancel', {
        onSuccess: () => {
            invalidateByPath(queryClient, 'get', '/integrations');
        },
    });
}
