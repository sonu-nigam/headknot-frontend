import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDisconnectIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ integrationId }: { integrationId: string }) => {
            const { error } = await api.POST(
                '/integrations/{id}/disconnect',
                { params: { path: { id: integrationId } } }
            );
            if (error) throw new Error('Failed to disconnect integration');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['integrations'],
            });
        },
    });
}
