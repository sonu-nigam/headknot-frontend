import { useMutation } from '@tanstack/react-query';
import { api, storage } from '@workspace/api-client';

export function useLogoutAll() {
    return useMutation({
        mutationFn: async () => {
            const { error } = await api.POST('/auth/logout-all');
            if (error) throw new Error('Logout all failed');
        },
        onSettled: () => {
            storage.clear();
        },
    });
}
