import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function useConnectNotion() {
    return useMutation({
        mutationFn: async () => {
            const { data, error } = await api.POST(
                '/integrations/oauth/notion/initiate',
            );
            if (error) throw new Error('Failed to initiate Notion OAuth');
            return data;
        },
        onSuccess: (data) => {
            if (data.authorizationUrl) {
                window.location.href = data.authorizationUrl;
            }
        },
    });
}
