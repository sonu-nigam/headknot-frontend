import { Schemas } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function draftByWorkspaceIdQueryOptions(id: string) {
    return queryOptions<Schemas['DraftResponse']>({
        queryKey: ['draft'],
        queryFn: async () => {
            const { error, data } = await api.GET(
                '/drafts/workspace/{workspaceId}',
                {
                    params: {
                        path: {
                            workspaceId: id,
                        },
                    },
                },
            );
            if (error) throw error;
            return data;
        },
    });
}
