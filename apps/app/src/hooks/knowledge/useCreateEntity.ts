import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useCreateEntity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Schemas['CreateEntityRequest']) => {
            const { data: result, error } = await api.POST(
                '/knowledge/entities',
                { body: data },
            );
            if (error) throw new Error('Failed to create entity');
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledge', 'entities'] });
        },
    });
}
