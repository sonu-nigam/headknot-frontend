import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDeleteEntity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (entityId: string) => {
            const { error } = await api.DELETE(
                '/knowledge/entities/{entityId}',
                { params: { path: { entityId } } },
            );
            if (error) throw new Error('Failed to delete entity');
        },
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/knowledge");
        },
    });
}
