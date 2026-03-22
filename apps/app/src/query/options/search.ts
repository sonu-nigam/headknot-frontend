import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const searchQueryOptions = ({
    workspaceId,
    query,
    limit,
    offset,
}: {
    workspaceId: string;
    query: string;
    limit?: number;
    offset?: number;
}) =>
    queryOptions<Schemas['SearchResponse']>({
        queryKey: ['search', workspaceId, query, limit, offset],
        enabled: !!query && !!workspaceId,
        queryFn: async () => {
            const res = await api.GET('/api/search', {
                params: {
                    query: {
                        workspaceId,
                        query,
                        limit,
                        offset,
                    },
                },
            });
            if (res.error) throw new Error('Search failed');
            return res.data;
        },
    });
