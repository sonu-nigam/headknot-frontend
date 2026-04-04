import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useCreateRelationship() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Schemas['CreateRelationshipRequest']) => {
            const { data: result, error } = await api.POST('/relationships', {
                body: data,
            });
            if (error) throw new Error('Failed to create relationship');
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledge', 'relationships'] });
        },
    });
}
