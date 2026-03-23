import { queryOptions } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

export const plansQueryOptions = queryOptions<Schemas['PlanResponse'][]>({
    queryKey: ['billing', 'plans'],
    queryFn: async () => {
        const res = await api.GET('/billing/plans');
        if (res.error) throw new Error('Failed to fetch plans');
        return res.data;
    },
});

export const planByNameQueryOptions = (name: string) =>
    queryOptions<Schemas['PlanResponse']>({
        queryKey: ['billing', 'plans', name],
        queryFn: async () => {
            const res = await api.GET('/billing/plans/{name}', {
                params: { path: { name } },
            });
            if (res.error) throw new Error('Failed to fetch plan');
            return res.data;
        },
    });

export const workspaceSubscriptionQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['SubscriptionResponse']>({
        queryKey: ['billing', 'subscription', workspaceId],
        queryFn: async () => {
            const res = await api.GET(
                '/billing/workspace/{workspaceId}/subscription',
                { params: { path: { workspaceId } } }
            );
            if (res.error) throw new Error('Failed to fetch subscription');
            return res.data;
        },
        enabled: !!workspaceId,
    });

export const workspaceUsageQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['UsageResponse'][]>({
        queryKey: ['billing', 'usage', workspaceId],
        queryFn: async () => {
            const res = await api.GET(
                '/billing/workspace/{workspaceId}/usage',
                { params: { path: { workspaceId } } }
            );
            if (res.error) throw new Error('Failed to fetch usage');
            return res.data;
        },
        enabled: !!workspaceId,
    });

export const workspaceLimitsQueryOptions = (workspaceId: string) =>
    queryOptions<Schemas['LimitCheckResponse'][]>({
        queryKey: ['billing', 'limits', workspaceId],
        queryFn: async () => {
            const res = await api.GET(
                '/billing/workspace/{workspaceId}/limits',
                { params: { path: { workspaceId } } }
            );
            if (res.error) throw new Error('Failed to fetch limits');
            return res.data;
        },
        enabled: !!workspaceId,
    });
