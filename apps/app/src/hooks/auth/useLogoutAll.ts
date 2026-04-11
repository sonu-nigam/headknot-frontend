import { $api, storage } from '@workspace/api-client';

export function useLogoutAll() {
    return $api.useMutation("post", "/auth/logout-all", {
        onSettled: () => {
            storage.clear();
        },
    });
}
