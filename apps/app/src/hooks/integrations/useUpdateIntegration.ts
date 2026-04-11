import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useUpdateIntegration() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/integrations/{integrationId}", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/integrations");
        },
    });
}
