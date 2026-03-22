import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useCreateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: Schemas['CreateWorkspaceRequest']) => {
            const { data, error } = await api.POST('/workspaces', { body });
            if (error) throw new Error('Failed to create workspace');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });
}
