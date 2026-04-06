import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useCreateGraphEntity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Schemas['CreateGraphEntityRequest']) => {
            const { data: result, error } = await api.POST(
                '/graph/entities',
                { body: data },
            );
            if (error) throw new Error('Failed to create graph entity');
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['graph', 'entities'] });
        },
    });
}
