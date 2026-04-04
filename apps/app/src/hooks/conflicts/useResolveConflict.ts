import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useResolveConflict() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await api.POST(
                '/conflicts/{id}/resolve',
                {
                    params: { path: { id } },
                },
            );
            if (error) throw new Error('Failed to resolve conflict');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conflicts'] });
            queryClient.invalidateQueries({ queryKey: ['timeline'] });
        },
    });
}
