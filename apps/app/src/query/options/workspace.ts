import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const myWorkspacesQueryOptions = queryOptions<
    Schemas['WorkspaceResponse'][]
>({
    queryKey: ['my-workspaces'],
    queryFn: async () => {
        const res = await api.GET('/workspaces/my-workspaces');
        if (res.error) throw new Error('Failed to fetch workspaces');
        return res.data;
    },
});

export const workspaceByIdQueryOptions = (id: string) =>
    queryOptions<Schemas['WorkspaceResponse']>({
        queryKey: ['workspace', id],
        queryFn: async () => {
            const res = await api.GET('/workspaces/{id}', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch workspace');
            return res.data;
        },
    });

export const memberWorkspacesQueryOptions = queryOptions<
    Schemas['WorkspaceResponse'][]
>({
    queryKey: ['workspaces', 'member'],
    queryFn: async () => {
        const res = await api.GET('/workspaces/member');
        if (res.error) throw new Error('Failed to fetch member workspaces');
        return res.data;
    },
});

export const activeWorkspacesQueryOptions = queryOptions<
    Schemas['WorkspaceResponse'][]
>({
    queryKey: ['workspaces', 'active'],
    queryFn: async () => {
        const res = await api.GET('/workspaces/active');
        if (res.error) throw new Error('Failed to fetch active workspaces');
        return res.data;
    },
});
