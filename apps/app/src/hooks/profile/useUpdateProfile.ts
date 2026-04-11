import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return $api.useMutation("put", "/profile/me", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/profile");
        },
    });
}
