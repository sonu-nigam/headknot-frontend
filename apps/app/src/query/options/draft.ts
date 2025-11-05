import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function getDraftByWorkspaceId(id: string) {
    return queryOptions({
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
