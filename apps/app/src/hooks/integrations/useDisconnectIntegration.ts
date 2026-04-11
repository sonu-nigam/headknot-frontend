import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useDisconnectIntegration() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/integrations/{id}/disconnect", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/integrations");
        },
    });
}
