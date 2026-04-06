import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDeleteGraphEntity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await api.DELETE('/graph/entities/{id}', {
                params: { path: { id } },
            });
            if (error) throw new Error('Failed to delete graph entity');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['graph'] });
        },
    });
}
