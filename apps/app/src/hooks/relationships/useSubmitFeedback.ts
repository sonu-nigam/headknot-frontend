import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

export function useSubmitFeedback() {
    const queryClient = useQueryClient();

    return $api.useMutation("post", "/relationships/{relationshipId}/feedback", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/relationships");
        },
    });
}
