import { $api, storage } from '@workspace/api-client';

/**
 * Verifies the email with the 6-digit code. On success the backend returns a
 * token pair (the user is logged in), so we persist the tokens exactly like
 * useLogin/useSignup did previously.
 */
export function useVerifyEmail() {
    return $api.useMutation('post', '/auth/verify-email', {
        onSuccess: (data) => {
            if (data?.accessToken) storage.access = data.accessToken;
            if (data?.refreshToken) storage.refresh = data.refreshToken;
        },
    });
}
