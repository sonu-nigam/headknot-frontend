import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const profileQueryOptions = queryOptions<Schemas['ProfileResponse']>({
    queryKey: ['my-profile'],
    queryFn: async () => {
        const res = await api.GET('/profile/me');
        if (res.error) throw new Error('Failed to fetch profile');
        return res.data;
    },
});

export const profileByIdQueryOptions = (id: string) =>
    queryOptions<Schemas['ProfileResponse']>({
        queryKey: ['profile', id],
        queryFn: async () => {
            const res = await api.GET('/profile/{id}', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch profile');
            return res.data;
        },
    });
