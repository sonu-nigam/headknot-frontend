import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Operations } from '@/types/api';

type Status = Operations['getClusters']['parameters']['query']['status'];
type Response = Operations['getClusters']['responses']['200']['content']['*/*'];

export const clusterQueryOptions = ({
    workspaceId,
    status,
}: {
    workspaceId: string;
    status: Status;
}) =>
    queryOptions<Response>({
        queryKey: ['clusters', workspaceId, status],
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
