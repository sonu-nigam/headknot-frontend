import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useSyncNotion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ integrationId }: { integrationId: string }) => {
            const { data, error } = await api.POST(
                '/integrations/notion/{integrationId}/sync',
                { params: { path: { integrationId } } }
            );
            if (error) throw new Error('Failed to sync Notion');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['integrations'],
            });
        },
    });
}
