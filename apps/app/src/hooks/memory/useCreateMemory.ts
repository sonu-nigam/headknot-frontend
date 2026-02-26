import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

interface UseCreateMemoryProps {
    clusterId?: string;
    workspaceId: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export function useCreateMemory({
    clusterId,
    workspaceId,
    onSuccess,
    onError,
}: UseCreateMemoryProps) {
    return useMutation({
        mutationFn: async () => {
            const { data, error } = await api.POST('/memory', {
                body: { clusterId, workspaceId },
            });

            if (error) throw new Error('Failed to create memory');
            return data;
        },
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error);
        },
    });
}
