import AppLayout from '@/components/AppLayout';
import { MainEditor } from '@/forms/editor/MainEditor';
import { useCommitMemory } from '@/hooks/memory/useCommitMemory';
import { useUpdateMemoryBlocks } from '@/hooks/memory/useUpdateMemoryBlocks';
import { Block } from '@/lib/editorValueTransformer';
import { extractMemoryIdFromSlug } from '@/lib/memoryUtils';
import { memoryByIdQueryOptions } from '@/query/options/memory';
import {
    useQueryErrorResetBoundary,
    useSuspenseQuery,
} from '@tanstack/react-query';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useDebounceFn } from 'ahooks';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

export default function MemoryPage() {
    const { reset } = useQueryErrorResetBoundary();
    const navigate = useNavigate();

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory', href: '/memory' },
            ]}
        >
            <div className="max-w-4xl mx-auto px-3 w-full flex-1 flex flex-col pb-8">
                <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ resetErrorBoundary, error }) => {
                        resetErrorBoundary();
                        navigate('/not-found', { replace: true });
                        return null;
                    }}
                >
                    <Suspense fallback={<MemoryLoading />}>
                        <Memory />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </AppLayout>
    );
}

function Memory() {
    const params = useParams();
    const memoryId = extractMemoryIdFromSlug(params.memorySlug || null);

    const { data: initialBlocks } = useSuspenseQuery({
        ...memoryByIdQueryOptions(memoryId || ''),
        retry: 0,
        select: (data) =>
            (data.blocks || []).map((block) => ({
                ...block,
                id: block.id || 'placeholder-id', // Ensure `id` is a string
                kind: block.kind as Block['kind'],
                data: Array.isArray(block.data) ? block.data : [],
                text: '',
                index: block.index as number,
                parentId: block.parentId || null,
            })),
    });

    const updateBlocks = useUpdateMemoryBlocks({
        memoryId,
        onSuccess: () => {
            console.info('Memory updated successfully');
        },
        onError: (error) => {
            console.error(error.message);
        },
    });

    const commitMemory = useCommitMemory({ memoryId });
    const debouncedCommitMemory = useDebounceFn(commitMemory.mutateAsync, {
        wait: 1 * 2 * 1000,
    });

    const onChange = async (blocks: Block[]) => {
        await updateBlocks.mutateAsync({ blocks });

        await debouncedCommitMemory.run();
    };

    useEffect(() => {
        const saveOnClose = () => {
            if (document.visibilityState === 'hidden') {
                commitMemory.mutateAsync();
            }
        };

        document.addEventListener('visibilitychange', saveOnClose);
        return () =>
            document.removeEventListener('visibilitychange', saveOnClose);
    }, [memoryId]);

    return (
        <div>
            <div className="mt-10 pb-32">
                <MainEditor initialValue={initialBlocks} onChange={onChange} />
            </div>
        </div>
    );
}

function MemoryLoading() {
    return (
        <div className="px-4 flex-1">
            <div className="mt-10">
                <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className={`h-4 ${i % 3 === 0 ? 'w-3/4' : 'w-full'} rounded-md`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
