import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useSubscribeWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            workspaceId,
            body,
        }: {
            workspaceId: string;
            body: Schemas['SubscribeRequest'];
        }) => {
            const { data, error } = await api.POST(
                '/billing/workspace/{workspaceId}/subscribe',
                { params: { path: { workspaceId } }, body }
            );
            if (error) throw new Error('Failed to subscribe workspace');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'subscription', variables.workspaceId],
            });
            queryClient.invalidateQueries({
                queryKey: ['billing', 'limits', variables.workspaceId],
            });
        },
    });
}
