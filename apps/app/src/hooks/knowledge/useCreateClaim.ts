import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useCreateClaim() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Schemas['CreateClaimRequest']) => {
            const { data: result, error } = await api.POST(
                '/knowledge/claims',
                { body: data },
            );
            if (error) throw new Error('Failed to create claim');
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledge', 'claims'] });
        },
    });
}
