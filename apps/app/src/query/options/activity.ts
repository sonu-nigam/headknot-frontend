import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const activityListQueryOptions = ({
    offset,
    limit,
}: {
    offset?: number;
    limit?: number;
} = {}) =>
    queryOptions<Schemas['ActivityLogResponse'][]>({
        queryKey: ['activity', offset, limit],
        queryFn: async () => {
            const res = await api.GET('/activity/', {
                params: {
                    query: {
                        offset,
                        limit,
                    },
                },
            });
            if (res.error) throw new Error('Failed to fetch activities');
            return res.data;
        },
    });
