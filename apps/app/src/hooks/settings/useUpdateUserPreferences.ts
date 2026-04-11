import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useUpdateUserPreferences() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/settings/user", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/settings");
        },
    });
}
