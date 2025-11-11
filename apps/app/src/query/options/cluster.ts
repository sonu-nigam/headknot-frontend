import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const clusterQueryOptions = ({
    workspaceId,
    status,
}: {
    workspaceId: string;
    status: 'ACTIVE';
}) =>
    queryOptions<Schemas['Cluster'][]>({
        queryKey: ['clusters', workspaceId],
        queryFn: async () => {
            const res = await api.GET('/clusters', {
                params: {
                    query: {
                        workspaceId,
                        status,
                    },
                },
            });
            if (res.error) throw new Error('Failed to fetch workspaces');
            return res.data;
        },
    });
