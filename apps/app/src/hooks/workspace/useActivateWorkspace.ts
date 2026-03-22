import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useActivateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await api.POST(
                '/workspaces/{id}/activate',
                {
                    params: { path: { id } },
                },
            );
            if (error) throw new Error('Failed to activate workspace');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
