import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useRetrySyncRunItem() {
    const queryClient = useQueryClient();

    return $api.useMutation(
        'post',
        '/integrations/{id}/sync-runs/{runId}/items/{itemId}/retry',
        {
            onSuccess: () => {
                invalidateByPath(queryClient, 'get', '/integrations');
            },
        },
    );
}
