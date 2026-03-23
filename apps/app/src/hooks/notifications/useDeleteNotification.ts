import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const { error } = await api.DELETE('/notifications/{id}', {
                params: { path: { id } },
            });
            if (error) throw new Error('Failed to delete notification');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
        },
    });
}
