import { useMutation } from '@tanstack/react-query';
import { api, storage } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useLogin() {
    return useMutation({
        mutationFn: async (body: Schemas['LoginRequest']) => {
            const { data, error } = await api.POST('/auth/login', { body });
            if (error) throw new Error('Login failed');
            return data;
        },
        onSuccess: (data) => {
            if (data?.accessToken) storage.access = data.accessToken;
            if (data?.refreshToken) storage.refresh = data.refreshToken;
        },
    });
}
