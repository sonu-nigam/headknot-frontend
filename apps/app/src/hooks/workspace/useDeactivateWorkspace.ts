import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDeactivateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await api.POST(
                '/workspaces/{id}/deactivate',
                {
                    params: { path: { id } },
                },
            );
            if (error) throw new Error('Failed to deactivate workspace');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
