import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useAddAlias() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            entityId,
            alias,
        }: {
            entityId: string;
            alias: string;
        }) => {
            const { data, error } = await api.POST(
                '/knowledge/entities/{entityId}/aliases',
                {
                    params: { path: { entityId } },
                    body: { alias },
                },
            );
            if (error) throw new Error('Failed to add alias');
            return data;
        },
        onSuccess: (_data, variables) => {
            invalidateByPath(queryClient, "get", "/knowledge/entities");
        },
    });
}
