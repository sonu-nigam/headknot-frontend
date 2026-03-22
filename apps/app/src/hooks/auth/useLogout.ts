import { useMutation } from '@tanstack/react-query';
import { api, storage } from '@workspace/api-client';

export function useLogout() {
    return useMutation({
        mutationFn: async () => {
            const refreshToken = storage.refresh;
            if (!refreshToken) return;
            const { error } = await api.POST('/auth/logout', {
                body: { refreshToken },
            });
            if (error) throw new Error('Logout failed');
        },
        onSettled: () => {
            storage.clear();
        },
    });
}
