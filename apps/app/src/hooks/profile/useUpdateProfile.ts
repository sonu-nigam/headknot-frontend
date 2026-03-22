import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: Schemas['UpdateProfileRequest']) => {
            const { data, error } = await api.PUT('/profile/me', { body });
            if (error) throw new Error('Failed to update profile');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
        },
    });
}
