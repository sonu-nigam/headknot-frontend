import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDisconnectIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ integrationId }: { integrationId: string }) => {
            const { error } = await api.DELETE(
                '/integrations/{integrationId}',
                { params: { path: { integrationId } } }
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
