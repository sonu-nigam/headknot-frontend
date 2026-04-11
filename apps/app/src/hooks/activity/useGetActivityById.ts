import { $api } from '@workspace/api-client';

export function useGetActivityById() {
    return $api.useMutation("post", "/activity/{id}");
}
