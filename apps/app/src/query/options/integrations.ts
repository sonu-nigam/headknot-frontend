import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const integrationsQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['IntegrationResponse'][]>({
        queryKey: ['integrations', workspaceId],
        queryFn: async () => {
            const res = await api.GET(
                '/integrations/workspace/{workspaceId}',
                { params: { path: { workspaceId } } }
            );
            if (res.error) throw new Error('Failed to fetch integrations');
            return res.data;
        },
        enabled: !!workspaceId,
    });

export const integrationQueryOptions = (integrationId: string) =>
    queryOptions<Schemas['IntegrationResponse']>({
        queryKey: ['integrations', 'detail', integrationId],
        queryFn: async () => {
            const res = await api.GET('/integrations/{integrationId}', {
                params: { path: { integrationId } },
            });
            if (res.error) throw new Error('Failed to fetch integration');
            return res.data;
        },
        enabled: !!integrationId,
    });

export const integrationSyncStatusQueryOptions = (integrationId: string) =>
    queryOptions<Schemas['IntegrationSyncResponse']>({
        queryKey: ['integrations', 'sync', integrationId],
        queryFn: async () => {
            const res = await api.GET(
                '/integrations/{integrationId}/sync',
                { params: { path: { integrationId } } }
            );
            if (res.error) throw new Error('Failed to fetch sync status');
            return res.data;
        },
        enabled: !!integrationId,
    });

export const integrationProvidersQueryOptions = queryOptions<
    Schemas['IntegrationProviderResponse'][]
>({
    queryKey: ['integrations', 'providers'],
    queryFn: async () => {
        const res = await api.GET('/integrations/providers');
        if (res.error) throw new Error('Failed to fetch providers');
        return res.data;
    },
});
