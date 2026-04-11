import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useRollbackSnapshot(memoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (snapshotId: string) => {
            const { data, error } = await api.POST('/memory/{id}/rollback', {
                params: { path: { id: memoryId } },
                body: { snapshotId },
            });
            if (error) throw new Error('Failed to rollback snapshot');
            return data;
        },
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/memory");
        },
    });
}
