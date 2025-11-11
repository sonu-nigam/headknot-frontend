import { Schemas } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function draftQueryOptions({ workspaceId }: { workspaceId: string }) {
    return queryOptions<Schemas['DraftResponse']>({
        queryKey: ['draft', workspaceId],
        queryFn: async () => {
            const { error, data } = await api.GET('/drafts', {
                params: {
                    query: {
                        workspaceId,
                    },
                },
            });
            if (error) throw error;
            return data;
        },
    });
}
