import { Schemas } from '@/types/api';
import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function memoryListQueryOptions({
    workspaceId,
    clusterId,
    status,
}: {
    workspaceId?: string;
    clusterId?: string;
    status?: string;
}) {
    return queryOptions<Schemas['MemoryResponse'][]>({
        queryKey: ['memory', workspaceId, clusterId],
        queryFn: async () => {
            const { error, data } = await api.GET('/memory', {
                params: {
                    query: {
                        clusterId,
                        workspaceId,
                        status,
                    },
                },
            });
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

export function deleteMemoryQueryOptions(id: string) {
    return queryOptions<Schemas['MemoryResponse']>({
        queryKey: ['memory', id],
        queryFn: async () => {
            debugger;
            const { error, data } = await api.DELETE('/memory/{id}', {
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

// export function memoryCreateQueryOptions() {
//     return queryOptions<Schemas['MemoryResponse']>({
//         queryKey: ['memory', 'create'],
//         queryFn: async () => {
//             const { error, data } = await api.POST('/memory', {
//                 body: {
//                     title,
//                     content,
//                 },
//             });
//             if (error) throw error;
//             return data;
//         },
//     });
// }
