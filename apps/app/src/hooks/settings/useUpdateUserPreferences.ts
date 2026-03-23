import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useUpdateUserPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: {
            preferences: Record<string, unknown>;
        }) => {
            const { data, error } = await api.PUT('/settings/user', {
                body: body as never,
            });
            if (error) throw new Error('Failed to update user preferences');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['settings', 'user'],
            });
        },
    });
}
