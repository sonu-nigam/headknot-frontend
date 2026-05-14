import { $api } from '@workspace/api-client';

export function useSyncRun(
    integrationId: string | undefined,
    runId: string | undefined,
) {
    return $api.useQuery(
        'get',
        '/integrations/{id}/sync-runs/{runId}',
        {
            params: {
                path: { id: integrationId ?? '', runId: runId ?? '' },
            },
        },
        { enabled: !!integrationId && !!runId },
    );
}
