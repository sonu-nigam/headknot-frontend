import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useRemoveWorkspaceMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            workspaceId,
            memberId,
        }: {
            workspaceId: string;
            memberId: string;
        }) => {
            const { error } = await api.DELETE(
                '/workspaces/{id}/members/{memberId}',
                {
                    params: { path: { id: workspaceId, memberId } },
                },
            );
            if (error) throw new Error('Failed to remove member');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
