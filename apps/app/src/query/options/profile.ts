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
