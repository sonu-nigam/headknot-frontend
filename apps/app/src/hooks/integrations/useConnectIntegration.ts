import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useConnectIntegration() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/integrations/{id}/connect", {
        onSuccess: (data) => {
            if (data.oauthRequired && data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
                return;
            }
            invalidateByPath(queryClient, "get", "/integrations");
        },
    });
}
