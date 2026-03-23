import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const userSettingsQueryOptions = queryOptions<
    Schemas['UserSettingsResponse']
>({
    queryKey: ['settings', 'user'],
    queryFn: async () => {
        const res = await api.GET('/settings/user');
        if (res.error) throw new Error('Failed to fetch user settings');
        return res.data;
    },
});

export const workspaceSettingsQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['WorkspaceSettingsResponse']>({
        queryKey: ['settings', 'workspace', workspaceId],
        queryFn: async () => {
            const res = await api.GET('/settings/workspace/{workspaceId}', {
                params: { path: { workspaceId } },
            });
            if (res.error)
                throw new Error('Failed to fetch workspace settings');
            return res.data;
        },
        enabled: !!workspaceId,
    });
