import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useUpdateIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            integrationId,
            body,
        }: {
            integrationId: string;
            body: Schemas['UpdateIntegrationRequest'];
        }) => {
            const { data, error } = await api.PUT(
                '/integrations/{integrationId}',
                { params: { path: { integrationId } }, body }
            );
            if (error) throw new Error('Failed to update integration');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['integrations'],
            });
            queryClient.invalidateQueries({
                queryKey: ['integrations', 'detail', variables.integrationId],
            });
        },
    });
}
