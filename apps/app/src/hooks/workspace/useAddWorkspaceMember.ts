import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useAddWorkspaceMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            workspaceId,
            memberId,
        }: {
            workspaceId: string;
            memberId: string;
        }) => {
            const { data, error } = await api.POST(
                '/workspaces/{id}/members',
                {
                    params: { path: { id: workspaceId } },
                    body: { memberId },
                },
            );
            if (error) throw new Error('Failed to add member');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
