import { toast } from 'sonner';

interface ToastedMutationOptions {
    success: string;
    error: string;
    onSuccess?: () => void;
    onError?: (e: Error) => void;
}

/**
 * Returns onSuccess/onError handlers that fire Sonner toasts in the canonical
 * format used across the app (mirrors the existing billing hooks). Spread the
 * result into `$api.useMutation`'s options.
 *
 *   const toasts = useToastedMutation({
 *       success: 'Profile updated',
 *       error: "Couldn't update profile",
 *       onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-profile'] }),
 *   });
 *   const m = $api.useMutation('put', '/profile/me', { ...toasts });
 */
export function useToastedMutation({
    success,
    error,
    onSuccess,
    onError,
}: ToastedMutationOptions) {
    return {
        onSuccess: () => {
            toast.success(success);
            onSuccess?.();
        },
        onError: (e: Error) => {
            toast.error(`${error}: ${e.message}`);
            onError?.(e);
        },
    };
}
