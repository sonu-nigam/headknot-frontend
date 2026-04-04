import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useSubmitFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            relationshipId,
            ...body
        }: Schemas['SubmitFeedbackRequest'] & { relationshipId: string }) => {
            const { data, error } = await api.POST(
                '/relationships/{relationshipId}/feedback',
                {
                    params: { path: { relationshipId } },
                    body,
                },
            );
            if (error) throw new Error('Failed to submit feedback');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['knowledge', 'feedback', variables.relationshipId],
            });
            queryClient.invalidateQueries({
                queryKey: ['knowledge', 'relationships'],
            });
        },
    });
}
