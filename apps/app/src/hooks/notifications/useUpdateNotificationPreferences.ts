import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useUpdateNotificationPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: Schemas['UpdatePreferencesRequest']) => {
            const { data, error } = await api.PUT(
                '/notifications/preferences',
                { body }
            );
            if (error)
                throw new Error(
                    'Failed to update notification preferences'
                );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications', 'preferences'],
            });
        },
    });
}
