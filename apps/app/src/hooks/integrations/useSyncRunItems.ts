import { $api } from '@workspace/api-client';

export function useSyncRunItems(
    integrationId: string | undefined,
    runId: string | undefined,
    options: { status?: string; limit?: number; offset?: number } = {},
) {
    const status = options.status ?? 'FAILED';
    return $api.useQuery(
        'get',
        '/integrations/{id}/sync-runs/{runId}/items',
        {
            params: {
                path: { id: integrationId ?? '', runId: runId ?? '' },
                query: {
                    status,
                    ...(options.limit !== undefined ? { limit: options.limit } : {}),
                    ...(options.offset !== undefined ? { offset: options.offset } : {}),
                },
            },
        },
        { enabled: !!integrationId && !!runId },
    );
}
