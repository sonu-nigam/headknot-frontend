import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const notificationsQueryOptions = (
    limit: number = 20,
    offset: number = 0
) =>
    queryOptions<Schemas['NotificationResponse'][]>({
        queryKey: ['notifications', limit, offset],
        queryFn: async () => {
            const res = await api.GET('/notifications', {
                params: { query: { limit, offset } },
            });
            if (res.error) throw new Error('Failed to fetch notifications');
            return res.data;
        },
    });

export const unreadNotificationsQueryOptions = queryOptions<
    Schemas['NotificationResponse'][]
>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
        const res = await api.GET('/notifications/unread');
        if (res.error) throw new Error('Failed to fetch unread notifications');
        return res.data;
    },
});

export const unreadCountQueryOptions = queryOptions<
    Schemas['UnreadCountResponse']
>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
        const res = await api.GET('/notifications/unread/count');
        if (res.error) throw new Error('Failed to fetch unread count');
        return res.data;
    },
});

export const notificationPreferencesQueryOptions = queryOptions<
    Schemas['NotificationPreferenceResponse']
>({
    queryKey: ['notifications', 'preferences'],
    queryFn: async () => {
        const res = await api.GET('/notifications/preferences');
        if (res.error)
            throw new Error('Failed to fetch notification preferences');
        return res.data;
    },
});
