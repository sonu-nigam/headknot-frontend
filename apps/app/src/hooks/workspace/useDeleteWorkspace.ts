import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await api.DELETE('/workspaces/{id}', {
                params: { path: { id } },
            });
            if (error) throw new Error('Failed to delete workspace');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
