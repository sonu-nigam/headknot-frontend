import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';
import { EVENT_TYPES } from '@/pages/Settings/sections/notificationCatalog';

/**
 * TEMPORARY ADAPTER — synthesizes a single channel × event-type matrix from
 * the two endpoints that currently store notification preferences:
 *
 *   GET /settings/user            → per-event booleans (free-form Record) + theme
 *   GET /notifications/preferences → global channel switches (inAppEnabled, emailEnabled)
 *
 * When the backend ships a single `/notifications/matrix` endpoint, replace
 * this hook's implementation but keep the returned shape stable so
 * NotificationMatrix.tsx does not need to change.
 */

export interface MatrixCell {
    inApp: boolean;
    email: boolean;
}

export type Matrix = Record<string, MatrixCell>;

export interface MatrixChannels {
    inAppEnabled: boolean;
    emailEnabled: boolean;
}

export function useNotificationMatrix() {
    const queryClient = useQueryClient();

    const settingsQuery = $api.useQuery('get', '/settings/user');
    const channelsQuery = $api.useQuery('get', '/notifications/preferences');

    const updateUser = $api.useMutation('put', '/settings/user');
    const updateChannels = $api.useMutation('put', '/notifications/preferences');

    const initialChannels: MatrixChannels = {
        inAppEnabled: channelsQuery.data?.inAppEnabled ?? true,
        emailEnabled: channelsQuery.data?.emailEnabled ?? true,
    };

    const initialPrefs = useMemo(
        () =>
            (settingsQuery.data?.preferences ?? {}) as Record<string, unknown>,
        [settingsQuery.data],
    );

    const initialMatrix = useMemo<Matrix>(() => {
        const result: Matrix = {};
        for (const evt of EVENT_TYPES) {
            // A single boolean from /settings/user means "in-app on; email
            // follows the global channel". Missing means default-on for in-app.
            const v = initialPrefs[evt.key];
            const inApp = typeof v === 'boolean' ? v : true;
            result[evt.key] = {
                inApp,
                email: initialChannels.emailEnabled && inApp,
            };
        }
        return result;
    }, [initialPrefs, initialChannels.emailEnabled]);

    const [channels, setChannels] = useState<MatrixChannels>(initialChannels);
    const [matrix, setMatrix] = useState<Matrix>(initialMatrix);

    // Reset state once the queries settle.
    useEffect(() => {
        if (!settingsQuery.isLoading && !channelsQuery.isLoading) {
            setChannels(initialChannels);
            setMatrix(initialMatrix);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsQuery.isLoading, channelsQuery.isLoading]);

    const save = async () => {
        const nextPrefs: Record<string, unknown> = { ...initialPrefs };
        for (const evt of EVENT_TYPES) {
            nextPrefs[evt.key] = matrix[evt.key]?.inApp ?? false;
        }
        await Promise.all([
            updateUser.mutateAsync({ body: { preferences: nextPrefs } }),
            updateChannels.mutateAsync({ body: channels }),
        ]);
        invalidateByPath(queryClient, 'get', '/settings');
        invalidateByPath(queryClient, 'get', '/notifications');
    };

    const dirty =
        channels.inAppEnabled !== initialChannels.inAppEnabled ||
        channels.emailEnabled !== initialChannels.emailEnabled ||
        EVENT_TYPES.some(
            (e) =>
                matrix[e.key]?.inApp !== initialMatrix[e.key]?.inApp ||
                matrix[e.key]?.email !== initialMatrix[e.key]?.email,
        );

    return {
        isLoading: settingsQuery.isLoading || channelsQuery.isLoading,
        isError: settingsQuery.isError || channelsQuery.isError,
        refetch: () => {
            settingsQuery.refetch();
            channelsQuery.refetch();
        },
        channels,
        matrix,
        dirty,
        isSaving: updateUser.isPending || updateChannels.isPending,
        setChannel: (channel: keyof MatrixChannels, value: boolean) =>
            setChannels((prev) => ({ ...prev, [channel]: value })),
        setCell: (key: string, channel: keyof MatrixCell, value: boolean) =>
            setMatrix((prev) => ({
                ...prev,
                [key]: { ...prev[key], [channel]: value },
            })),
        save,
    };
}
