import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useTriggerSync() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ integrationId }: { integrationId: string }) => {
            const { data, error } = await api.POST(
                '/integrations/{id}/sync',
                { params: { path: { id: integrationId } } }
            );
            if (error) throw new Error('Failed to trigger sync');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['integrations', 'sync', variables.integrationId],
            });
            queryClient.invalidateQueries({
                queryKey: ['integrations'],
            });
        },
    });
}
