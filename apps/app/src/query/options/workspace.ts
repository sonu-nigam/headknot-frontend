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
