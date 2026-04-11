import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useUpdateWorkspaceSettings() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/settings/workspace/{workspaceId}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/settings");
        },
    });
}
