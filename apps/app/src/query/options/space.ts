import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Operations } from '@/types/api';

type Status = Operations['getSpaces']['parameters']['query']['status'];
type Response = Operations['getSpaces']['responses']['200']['content']['*/*'];

export const spaceQueryOptions = ({
    workspaceId,
    status,
}: {
    workspaceId: string;
    status: Status;
}) =>
    queryOptions<Response>({
        queryKey: ['spaces', workspaceId, status],
        queryFn: async () => {
            const res = await api.GET('/space', {
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
