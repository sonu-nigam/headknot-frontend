import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useCreateGraphEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Schemas['CreateGraphEventRequest']) => {
            const { data: result, error } = await api.POST('/graph/events', {
                body: data,
            });
            if (error) throw new Error('Failed to create graph event');
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['graph', 'events'] });
            queryClient.invalidateQueries({ queryKey: ['graph', 'entity'] });
        },
    });
}
