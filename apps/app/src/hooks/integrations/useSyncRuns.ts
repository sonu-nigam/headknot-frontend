import { $api } from '@workspace/api-client';

export const DEFAULT_SYNC_RUNS_PAGE_SIZE = 20;

export function useSyncRuns(
    integrationId: string | undefined,
    options: { limit?: number; offset?: number } = {},
) {
    const limit = options.limit ?? DEFAULT_SYNC_RUNS_PAGE_SIZE;
    const offset = options.offset ?? 0;

    return $api.useQuery(
        'get',
        '/integrations/{id}/sync-runs',
        {
            params: {
                path: { id: integrationId ?? '' },
                query: { limit, offset },
            },
        },
        { enabled: !!integrationId },
    );
}
