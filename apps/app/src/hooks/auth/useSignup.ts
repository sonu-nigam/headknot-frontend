import { $api } from '@workspace/api-client';

/**
 * Signup no longer logs the user in — it creates an unverified account and the
 * backend emails a 6-digit code (response is { message, email }, no tokens).
 * The caller navigates to /verify-email; tokens are issued there on success.
 */
export function useSignup() {
    return $api.useMutation('post', '/auth/signup');
}
