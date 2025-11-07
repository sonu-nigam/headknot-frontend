import { Schemas } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function memoryListByWorkspaceIdQueryOptions(id: string) {
    return queryOptions<Schemas['MemoryResponse'][]>({
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

export function memoryByIdQueryOptions(id: string) {
    return queryOptions<Schemas['MemoryResponse']>({
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
