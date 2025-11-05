import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function myWorkspaces(id: number) {
    return queryOptions({
        queryKey: ['workspace'],
        queryFn: async () => {
            const { error, data } = await api.GET('/workspaces/my-workspaces');
            if (error) throw error;
            return data;
        },
    });
}
