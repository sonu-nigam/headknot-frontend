import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useAcknowledgeConflict() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await api.POST(
                '/conflicts/{id}/acknowledge',
                {
                    params: { path: { id } },
                },
            );
            if (error) throw new Error('Failed to acknowledge conflict');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conflicts'] });
            queryClient.invalidateQueries({ queryKey: ['timeline'] });
        },
    });
}
