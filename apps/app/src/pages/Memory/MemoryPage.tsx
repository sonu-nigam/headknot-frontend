import AppLayout from '@/components/AppLayout';
import PromptBox from '@/components/PromptBox';
import { Content } from '@/forms/QuickCaptureForm/Content';
import { Title } from '@/forms/QuickCaptureForm/Title';
import { Block } from '@/lib/editorValueTransformer';
import { extractMemoryIdFromSlug } from '@/lib/memoryUtils';
import { memoryByIdQueryOptions } from '@/query/options/memory';
import {
    useQueryErrorResetBoundary,
    useSuspenseQuery,
} from '@tanstack/react-query';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

export default function MemoryPage() {
    const { reset } = useQueryErrorResetBoundary();
    const navigate = useNavigate();
    const [memoryTitle, setMemoryTitle] = useState('New Memory');

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory', href: '/memory' },
                { label: memoryTitle },
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
                    {/*<MemoryLoading />*/}
                    <Suspense fallback={<MemoryLoading />}>
                        <Memory setMemoryTitle={setMemoryTitle} />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <PromptBox
                className="sticky bottom-0 px-3 pb-4 max-w-4xl mx-auto w-full"
                placeholder="What would you like to do? (Summarize, Cluster, Capture…)"
            />
        </AppLayout>
    );
}

function Memory({
    setMemoryTitle,
}: {
    setMemoryTitle: (title: string) => void;
}) {
    const params = useParams();
    const memoryId = extractMemoryIdFromSlug(params.memorySlug || null);

    const { data } = useSuspenseQuery({
        ...memoryByIdQueryOptions(memoryId || ''),
        retry: 0,
    });

    useEffect(() => {
        if (data?.title) setMemoryTitle(data.title);
    }, [data.title]);

    const blocks = (data.blocks || []).map((block) => ({
        ...block,
        id: block.id || 'placeholder-id', // Ensure `id` is a string
        kind: block.kind as Block['kind'],
        data: Array.isArray(block.data) ? block.data : [],
        index: block.index as number,
        parentId: block.parentId || null,
    }));

    return (
        <div>
            <div className="mt-20">
                <Title
                    initialValue={data.title as string}
                    memoryId={memoryId}
                />
            </div>
            <div className="mt-10 pb-32">
                <Content initialValue={blocks} memoryId={memoryId} />
            </div>
        </div>
    );
}

function MemoryLoading() {
    return (
        <div className="px-4 flex-1">
            <div className="mt-20">
                <Skeleton className="w-full h-14" />
            </div>
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
