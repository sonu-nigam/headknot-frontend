import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const { error } = await api.POST('/notifications/{id}/read', {
                params: { path: { id } },
            });
            if (error) throw new Error('Failed to mark notification as read');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
            });
        },
    });
}
