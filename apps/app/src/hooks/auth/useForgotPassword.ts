import { $api } from '@workspace/api-client';

/**
 * Requests a password reset code. The backend always responds 202 (it is a
 * no-op for unknown emails or OAuth-only accounts), so the caller confirms to
 * the user without revealing whether the account exists.
 */
export function useForgotPassword() {
    return $api.useMutation('post', '/auth/forgot-password');
}
