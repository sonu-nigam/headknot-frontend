import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useCheckoutSnapshot(memoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (snapshotId: string) => {
            const { data, error } = await api.POST('/memory/{id}/checkout', {
                params: { path: { id: memoryId } },
                body: { snapshotId },
            });
            if (error) throw new Error('Failed to checkout snapshot');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memory', memoryId] });
            queryClient.invalidateQueries({
                queryKey: ['snapshots', memoryId],
            });
        },
    });
}
