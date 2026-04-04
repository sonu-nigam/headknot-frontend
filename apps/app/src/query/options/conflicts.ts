import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const conflictsQueryOptions = ({
    workspaceId,
    status,
}: {
    workspaceId: string;
    status?: string;
}) =>
    queryOptions<Schemas['ConflictResponse'][]>({
        queryKey: ['conflicts', workspaceId, status],
        enabled: !!workspaceId,
        queryFn: async () => {
            const res = await api.GET('/conflicts', {
                params: { query: { workspaceId, status } },
            });
            if (res.error) throw new Error('Failed to fetch conflicts');
            return res.data;
        },
    });

export const conflictByIdQueryOptions = (id: string) =>
    queryOptions<Schemas['ConflictResponse']>({
        queryKey: ['conflicts', 'detail', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await api.GET('/conflicts/{id}', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch conflict');
            return res.data;
        },
    });
