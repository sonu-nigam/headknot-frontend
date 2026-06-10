import { $api } from '@workspace/api-client';

/**
 * Resets the password with the 6-digit code. On success the backend returns
 * 204 (no tokens) and terminates all existing sessions, so the user is sent
 * back to the login screen to sign in with the new password.
 */
export function useResetPassword() {
    return $api.useMutation('post', '/auth/reset-password');
}
