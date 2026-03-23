import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const entitiesByMemoryQueryOptions = (memoryId: string) =>
    queryOptions<Schemas['MemoryEntityLinkResponse'][]>({
        queryKey: ['knowledge', 'entities-by-memory', memoryId],
        enabled: !!memoryId,
        queryFn: async () => {
            const res = await api.GET(
                '/knowledge/entities/by-memory/{memoryId}',
                {
                    params: { path: { memoryId } },
                },
            );
            if (res.error) throw new Error('Failed to fetch entities');
            return res.data;
        },
    });

export const entityByIdQueryOptions = (entityId: string) =>
    queryOptions<Schemas['EntityResponse']>({
        queryKey: ['knowledge', 'entity', entityId],
        enabled: !!entityId,
        queryFn: async () => {
            const res = await api.GET('/knowledge/entities/{entityId}', {
                params: { path: { entityId } },
            });
            if (res.error) throw new Error('Failed to fetch entity');
            return res.data;
        },
    });

export const entitiesByWorkspaceQueryOptions = ({
    workspaceId,
    type,
}: {
    workspaceId: string;
    type?: Schemas['CreateEntityRequest']['entityType'];
}) =>
    queryOptions<Schemas['EntityResponse'][]>({
        queryKey: ['knowledge', 'entities', workspaceId, type],
        enabled: !!workspaceId,
        queryFn: async () => {
            const res = await api.GET('/knowledge/entities', {
                params: { query: { workspaceId, type } },
            });
            if (res.error) throw new Error('Failed to fetch entities');
            return res.data;
        },
    });

export const claimsByBlockQueryOptions = (blockId: string) =>
    queryOptions<Schemas['ClaimResponse'][]>({
        queryKey: ['knowledge', 'claims', 'block', blockId],
        enabled: !!blockId,
        queryFn: async () => {
            const res = await api.GET('/knowledge/claims', {
                params: { query: { blockId } },
            });
            if (res.error) throw new Error('Failed to fetch claims');
            return res.data;
        },
    });

export const claimsBySnapshotQueryOptions = (snapshotId: string) =>
    queryOptions<Schemas['ClaimResponse'][]>({
        queryKey: ['knowledge', 'claims', 'snapshot', snapshotId],
        enabled: !!snapshotId,
        queryFn: async () => {
            const res = await api.GET('/knowledge/claims', {
                params: { query: { snapshotId } },
            });
            if (res.error) throw new Error('Failed to fetch claims');
            return res.data;
        },
    });

export const claimsByEntityQueryOptions = (entityId: string) =>
    queryOptions<Schemas['ClaimResponse'][]>({
        queryKey: ['knowledge', 'claims', 'entity', entityId],
        enabled: !!entityId,
        queryFn: async () => {
            const res = await api.GET('/knowledge/claims', {
                params: { query: { entityId } },
            });
            if (res.error) throw new Error('Failed to fetch claims');
            return res.data;
        },
    });

export const relationshipsByClaimQueryOptions = (claimId: string) =>
    queryOptions<Schemas['RelationshipResponse'][]>({
        queryKey: ['knowledge', 'relationships', claimId],
        enabled: !!claimId,
        queryFn: async () => {
            const res = await api.GET('/relationships', {
                params: { query: { claimId } },
            });
            if (res.error) throw new Error('Failed to fetch relationships');
            return res.data;
        },
    });

export const memoriesForEntityQueryOptions = (entityId: string) =>
    queryOptions<Schemas['MemoryEntityLinkResponse'][]>({
        queryKey: ['knowledge', 'memories-for-entity', entityId],
        enabled: !!entityId,
        queryFn: async () => {
            const res = await api.GET(
                '/knowledge/entities/{entityId}/memories',
                {
                    params: { path: { entityId } },
                },
            );
            if (res.error) throw new Error('Failed to fetch memories');
            return res.data;
        },
    });
