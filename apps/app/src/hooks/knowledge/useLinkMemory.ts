import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useLinkMemory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            entityId,
            ...body
        }: Schemas['LinkMemoryRequest'] & { entityId: string }) => {
            const { data, error } = await api.POST(
                '/knowledge/entities/{entityId}/memories',
                {
                    params: { path: { entityId } },
                    body,
                },
            );
            if (error) throw new Error('Failed to link memory');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['knowledge', 'memories-for-entity', variables.entityId],
            });
        },
    });
}
