import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';

/**
 * Marks the current user's onboarding as complete (idempotent on the backend) and refreshes the
 * cached onboarding status so the route guard sees the user as onboarded immediately.
 */
export function useCompleteOnboarding() {
    const queryClient = useQueryClient();
    return $api.useMutation('post', '/onboarding/complete', {
        onSuccess: () => {
            invalidateByPath(queryClient, 'get', '/onboarding/status');
        },
    });
}
