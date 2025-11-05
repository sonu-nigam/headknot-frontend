import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function getMyWorkspaces() {
    return queryOptions({
        queryKey: ['workspace'],
        queryFn: async () => {
            const { error, data } = await api.GET('/workspaces/my-workspaces');
            if (error) throw error;
            return data;
        },
    });
}

export function getMemoryListByWorkspaceId(id: string) {
    return queryOptions({
        queryKey: ['memory'],
        queryFn: async () => {
            const { error, data } = await api.GET(
                '/memory/workspace/{workspaceId}',
                {
                    params: {
                        path: {
                            workspaceId: id,
                        },
                    },
                },
            );
            if (error) throw error;
            return data;
        },
    });
}

export function getMemoryById(id: string) {
    return queryOptions({
        queryKey: ['memory', id],
        queryFn: async () => {
            const { error, data } = await api.GET('/memory/{id}', {
                params: {
                    path: {
                        id,
                    },
                },
            });
            if (error) throw error;
            return data;
        },
    });
}
