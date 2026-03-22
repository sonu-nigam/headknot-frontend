import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useGetActivityById() {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await api.POST('/activity/{id}', {
                params: { path: { id } },
            });
            if (error) throw new Error('Failed to fetch activity');
            return data;
        },
    });
}
