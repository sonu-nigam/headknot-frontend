import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useConnectIntegration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            integrationId,
            body,
        }: {
            integrationId: string;
            body: Schemas['ConnectIntegrationRequest'];
        }) => {
            const { data, error } = await api.POST(
                '/integrations/{id}/connect',
                { params: { path: { id: integrationId } }, body }
            );
            if (error) throw new Error('Failed to connect integration');
            return data;
        },
        onSuccess: (data) => {
            if (data.oauthRequired && data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
                return;
            }
            queryClient.invalidateQueries({
                queryKey: ['integrations'],
            });
        },
    });
}
