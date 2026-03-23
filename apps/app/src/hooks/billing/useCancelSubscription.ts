import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workspaceId }: { workspaceId: string }) => {
            const { data, error } = await api.POST(
                '/billing/workspace/{workspaceId}/cancel',
                { params: { path: { workspaceId } } }
            );
            if (error) throw new Error('Failed to cancel subscription');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['billing', 'subscription', variables.workspaceId],
            });
        },
    });
}
