import { $api } from '@workspace/api-client';
import { toast } from 'sonner';

/**
 * Re-sends the verification code. The backend always responds 202 (it is a
 * no-op for unknown or already-verified emails), so we just confirm to the user.
 */
export function useResendVerification() {
    return $api.useMutation('post', '/auth/resend-verification', {
        onSuccess: () => {
            toast.success('Verification code sent. Check your inbox.');
        },
        onError: (e: Error) => {
            toast.error(`Couldn't resend the code: ${e.message}`);
        },
    });
}
