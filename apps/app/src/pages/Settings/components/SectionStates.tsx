import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

interface SectionSkeletonProps {
    rows?: number;
}

export function SectionSkeleton({ rows = 3 }: SectionSkeletonProps) {
    return (
        <Card>
            <CardContent className="space-y-3 py-6">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                {Array.from({ length: rows }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                ))}
            </CardContent>
        </Card>
    );
}

interface SectionErrorProps {
    message?: string;
    onRetry?: () => void;
}

export function SectionError({
    message = 'Something went wrong. Please try again.',
    onRetry,
}: SectionErrorProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <AlertTriangle className="size-6 text-destructive" />
                <p className="text-sm text-muted-foreground">{message}</p>
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={onRetry}
                    >
                        <RotateCcw className="size-3.5" />
                        Try again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <Icon className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">{title}</p>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
