import AppLayout from '@/components/AppLayout';
import { Memory } from '@/components/memory/Memory';
import {
    useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

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
            <div className="mt-10 px-3 w-full pb-8 max-w-4xl mx-auto">
                <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ resetErrorBoundary, error }) => {
                        // resetErrorBoundary();
                        // navigate('/not-found', { replace: true });
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
