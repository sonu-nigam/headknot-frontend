import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const graphEntitiesQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['GraphEntityResponse'][]>({
        queryKey: ['graph', 'entities', workspaceId],
        enabled: !!workspaceId,
        queryFn: async () => {
            const res = await api.GET('/graph/entities', {
                params: { query: { workspaceId } },
            });
            if (res.error) throw new Error('Failed to fetch graph entities');
            return res.data;
        },
    });

export const graphEntityByIdQueryOptions = (id: string) =>
    queryOptions<Schemas['GraphEntityResponse']>({
        queryKey: ['graph', 'entity', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await api.GET('/graph/entities/{id}', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch graph entity');
            return res.data;
        },
    });

export const graphEntityEventsQueryOptions = (id: string) =>
    queryOptions<Schemas['GraphEventResponse'][]>({
        queryKey: ['graph', 'entity', id, 'events'],
        enabled: !!id,
        queryFn: async () => {
            const res = await api.GET('/graph/entities/{id}/events', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch entity events');
            return res.data;
        },
    });

export const graphEntityNeighborsQueryOptions = (id: string) =>
    queryOptions<Schemas['GraphNeighborResponse'][]>({
        queryKey: ['graph', 'entity', id, 'neighbors'],
        enabled: !!id,
        queryFn: async () => {
            const res = await api.GET('/graph/entities/{id}/neighbors', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch neighbors');
            return res.data;
        },
    });

export const graphEventsQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['GraphEventResponse'][]>({
        queryKey: ['graph', 'events', workspaceId],
        enabled: !!workspaceId,
        queryFn: async () => {
            const res = await api.GET('/graph/events', {
                params: { query: { workspaceId } },
            });
            if (res.error) throw new Error('Failed to fetch graph events');
            return res.data;
        },
    });

export const graphEventByIdQueryOptions = (id: string) =>
    queryOptions<Schemas['GraphEventResponse']>({
        queryKey: ['graph', 'event', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await api.GET('/graph/events/{id}', {
                params: { path: { id } },
            });
            if (res.error) throw new Error('Failed to fetch graph event');
            return res.data;
        },
    });

export const graphPathQueryOptions = ({
    from,
    to,
}: {
    from: string;
    to: string;
}) =>
    queryOptions<Schemas['GraphPathResponse']>({
        queryKey: ['graph', 'path', from, to],
        enabled: !!from && !!to,
        queryFn: async () => {
            const res = await api.GET('/graph/query/path', {
                params: { query: { from, to } },
            });
            if (res.error) throw new Error('Failed to find path');
            return res.data;
        },
    });

export const graphTemporalQueryOptions = ({
    entityId,
    from,
    to,
}: {
    entityId: string;
    from: string;
    to: string;
}) =>
    queryOptions<Schemas['GraphEventResponse'][]>({
        queryKey: ['graph', 'temporal', entityId, from, to],
        enabled: !!entityId && !!from && !!to,
        queryFn: async () => {
            const res = await api.GET('/graph/query/temporal', {
                params: { query: { entityId, from, to } },
            });
            if (res.error) throw new Error('Failed to query temporal');
            return res.data;
        },
    });
