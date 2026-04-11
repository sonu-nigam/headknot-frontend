import { $api, storage } from '@workspace/api-client';

export function useLogin() {
    return $api.useMutation("post", "/auth/login", {
        onSuccess: (data) => {
            if (data?.accessToken) storage.access = data.accessToken;
            if (data?.refreshToken) storage.refresh = data.refreshToken;
        },
    });
}
