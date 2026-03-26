import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useConnectIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            workspaceId,
            body,
        }: {
            workspaceId: string;
            body: Schemas['ConnectIntegrationRequest'];
        }) => {
            const { data, error } = await api.POST(
                '/integrations/workspace/{workspaceId}',
                { params: { path: { workspaceId } }, body }
            );
            if (error) throw new Error('Failed to connect integration');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['integrations', variables.workspaceId],
            });
        },
    });
}
