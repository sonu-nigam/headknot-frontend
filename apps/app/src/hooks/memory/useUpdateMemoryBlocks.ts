import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Block } from '@/lib/editorValueTransformer';

interface UseUpdateBlocksProps {
    memoryId: string;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

export function useUpdateMemoryBlocks({
    memoryId,
    ...rest
}: UseUpdateBlocksProps) {
    return useMutation({
        mutationFn: async ({ blocks }: { blocks: Block[] }) => {
            if (!memoryId) throw new Error('Memory ID is required');

            const { error, data } = await api.PUT('/memory/{id}/blocks', {
                params: {
                    path: { id: memoryId },
                },
                body: { blocks },
            });

            if (error) throw error;
            return data;
        },
        ...rest,
    });
}
