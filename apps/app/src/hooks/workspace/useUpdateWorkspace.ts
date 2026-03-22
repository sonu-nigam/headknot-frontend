import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            body,
        }: {
            id: string;
            body: Schemas['UpdateWorkspaceRequest'];
        }) => {
            const { data, error } = await api.PUT('/workspaces/{id}', {
                params: { path: { id } },
                body,
            });
            if (error) throw new Error('Failed to update workspace');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
