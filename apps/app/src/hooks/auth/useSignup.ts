import { $api, storage } from '@workspace/api-client';

export function useSignup() {
    return $api.useMutation("post", "/auth/signup", {
        onSuccess: (data) => {
            if (data?.accessToken) storage.access = data.accessToken;
            if (data?.refreshToken) storage.refresh = data.refreshToken;
        },
    });
}
