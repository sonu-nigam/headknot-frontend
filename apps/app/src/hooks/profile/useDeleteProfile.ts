import { useMutation } from '@tanstack/react-query';
import { api, storage } from '@workspace/api-client';

export function useDeleteProfile() {
    return useMutation({
        mutationFn: async () => {
            const { error } = await api.DELETE('/profile/me');
            if (error) throw new Error('Failed to delete profile');
        },
        onSuccess: () => {
            storage.clear();
        },
    });
}
