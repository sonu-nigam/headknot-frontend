import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useUpdateWorkspaceSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            workspaceId,
            body,
        }: {
            workspaceId: string;
            body: { settings: Record<string, unknown> };
        }) => {
            const { data, error } = await api.PUT(
                '/settings/workspace/{workspaceId}',
                {
                    params: { path: { workspaceId } },
                    body: body as never,
                }
            );
            if (error) throw new Error('Failed to update workspace settings');
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['settings', 'workspace', variables.workspaceId],
            });
        },
    });
}
