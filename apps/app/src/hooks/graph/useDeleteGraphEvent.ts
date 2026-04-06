import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDeleteGraphEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await api.DELETE('/graph/events/{id}', {
                params: { path: { id } },
            });
            if (error) throw new Error('Failed to delete graph event');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['graph'] });
        },
    });
}
