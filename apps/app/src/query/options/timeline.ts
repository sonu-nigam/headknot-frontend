import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const objectTimelineQueryOptions = ({
    objectType,
    objectId,
}: {
    objectType: string;
    objectId: string;
}) =>
    queryOptions<Schemas['TimelineEventResponse'][]>({
        queryKey: ['timeline', objectType, objectId],
        enabled: !!objectId && !!objectType,
        queryFn: async () => {
            const res = await api.GET('/timeline', {
                params: { query: { objectType, objectId } },
            });
            if (res.error) throw new Error('Failed to fetch timeline');
            return res.data;
        },
    });

export const workspaceChangesQueryOptions = ({
    workspaceId,
    since,
}: {
    workspaceId: string;
    since: string;
}) =>
    queryOptions<Schemas['TimelineEventResponse'][]>({
        queryKey: ['timeline', 'changes', workspaceId, since],
        enabled: !!workspaceId && !!since,
        queryFn: async () => {
            const res = await api.GET('/timeline/changes', {
                params: { query: { workspaceId, since } },
            });
            if (res.error) throw new Error('Failed to fetch changes');
            return res.data;
        },
    });
