import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

interface UseCommitMemoryProps {
    memoryId: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export function useCommitMemory({
    memoryId,
    onSuccess,
    onError,
}: UseCommitMemoryProps) {
    return useMutation({
        mutationFn: async () => {
            const { error, data } = await api.POST(
                '/memory/{id}/blocks/commit',
                {
                    params: {
                        path: {
                            id: memoryId || '',
                        },
                    },
                    headers: {
                        keepAlive: true,
                    },
                },
            );
            if (error) throw error;
            return data;
        },
        onSuccess,
        onError,
    });
}
