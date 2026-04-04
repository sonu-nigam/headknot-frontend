import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useDeleteRelationship() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (relationshipId: string) => {
            const { error } = await api.DELETE(
                '/relationships/{relationshipId}',
                { params: { path: { relationshipId } } },
            );
            if (error) throw new Error('Failed to delete relationship');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledge', 'relationships'] });
        },
    });
}
