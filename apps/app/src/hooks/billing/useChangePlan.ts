import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useChangePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            workspaceId,
            body,
        }: {
            workspaceId: string;
            body: Schemas['ChangePlanRequest'];
        }) => {
            const { data, error } = await api.PUT(
                '/billing/workspace/{workspaceId}/plan',
                { params: { path: { workspaceId } }, body }
            );
            if (error) throw new Error('Failed to change plan');
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
