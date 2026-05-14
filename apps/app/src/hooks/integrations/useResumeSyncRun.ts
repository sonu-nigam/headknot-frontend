import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useResumeSyncRun() {
    const queryClient = useQueryClient();

    return $api.useMutation('post', '/integrations/{id}/sync-runs/{runId}/resume', {
        onSuccess: () => {
            invalidateByPath(queryClient, 'get', '/integrations');
        },
    });
}
