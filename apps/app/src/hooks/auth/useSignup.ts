import { useMutation } from '@tanstack/react-query';
import { api, storage } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useSignup() {
    return useMutation({
        mutationFn: async (body: Schemas['SignupRequest']) => {
            const { data, error } = await api.POST('/auth/signup', { body });
            if (error) throw new Error('Signup failed');
            return data;
        },
        onSuccess: (data) => {
            if (data?.accessToken) storage.access = data.accessToken;
            if (data?.refreshToken) storage.refresh = data.refreshToken;
        },
    });
}
