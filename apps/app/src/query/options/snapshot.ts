import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const snapshotListQueryOptions = (memoryId: string) =>
    queryOptions<Schemas['SnapshotResponse'][]>({
        queryKey: ['snapshots', memoryId],
        enabled: !!memoryId,
        queryFn: async () => {
            const res = await api.GET('/memory/{id}/snapshots', {
                params: { path: { id: memoryId } },
            });
            if (res.error) throw new Error('Failed to fetch snapshots');
            return res.data;
        },
    });
