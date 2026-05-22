import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Eye,
    Loader2,
    Zap,
} from 'lucide-react';
import { Schemas } from '@/types/api';
import { $api } from '@workspace/api-client';
import { useAcknowledgeConflict } from '@/hooks/conflicts/useAcknowledgeConflict';
import { useResolveConflict } from '@/hooks/conflicts/useResolveConflict';
import { formatDistanceToNow } from 'date-fns';

// --- Status Badge ---

type ConflictStatus = NonNullable<Schemas['ConflictResponse']['status']>;

function ConflictStatusBadge({ status }: { status?: ConflictStatus }) {
    if (status === 'ACTIVE') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900">
                Active
            </span>
        );
    }
    if (status === 'ACKNOWLEDGED') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900">
                Acknowledged
            </span>
        );
    }
    if (status === 'RESOLVED') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900">
                Resolved
            </span>
        );
    }
    return null;
}

// --- Claim Card ---

function ClaimCard({
    label,
    claimId,
    side,
}: {
    label: string;
    claimId?: string;
    side: 'source' | 'target';
}) {
    const borderColor =
        side === 'source'
            ? 'border-l-blue-500'
            : 'border-l-orange-500';

    return (
        <div
            className={`bg-card p-5 rounded-lg shadow-sm border-l-4 ${borderColor} border`}
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                </span>
            </div>
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                    Claim ID: {claimId?.slice(0, 8) ?? '—'}
                </p>
            </div>
        </div>
    );
}

// --- Conflict Metadata ---

function ConflictMetadata({
    conflict,
}: {
    conflict: Schemas['ConflictResponse'];
}) {
    const timestamps = [
        { label: 'Detected', value: conflict.createdAt },
        { label: 'Last Updated', value: conflict.updatedAt },
        { label: 'Acknowledged', value: conflict.acknowledgedAt },
        { label: 'Resolved', value: conflict.resolvedAt },
    ].filter((t) => t.value);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timestamps.map((t) => (
                <div key={t.label} className="p-4 bg-muted rounded-lg">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                        {t.label}
                    </p>
                    <p className="text-sm font-medium">
                        {t.value
                            ? formatDistanceToNow(new Date(t.value), {
                                  addSuffix: true,
                              })
                            : '—'}
                    </p>
                </div>
            ))}
        </div>
    );
}

// --- Main Page ---

export function ConflictDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: conflict, isLoading } = $api.useQuery("get", "/conflicts/{id}", {
        params: { path: { id: id ?? '' } },
    }, { enabled: !!id });

    const acknowledge = useAcknowledgeConflict();
    const resolve = useResolveConflict();

    if (isLoading) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Conflicts', href: '/conflicts' },
                    { label: 'Loading...' },
                ]}
            >
                <div className="flex items-center justify-center flex-1">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    if (!conflict) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Conflicts', href: '/conflicts' },
                    { label: 'Not Found' },
                ]}
            >
                <div className="flex items-center justify-center flex-1">
                    <div className="text-center space-y-3">
                        <AlertTriangle className="size-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                            Conflict not found
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/conflicts')}
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const confidencePercent = Math.round((conflict.confidence ?? 0) * 100);

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Conflicts', href: '/conflicts' },
                { label: `Conflict #${id?.slice(0, 8)}` },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Back + Header */}
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 mb-4 -ml-2 text-muted-foreground"
                            onClick={() => navigate('/conflicts')}
                        >
                            <ArrowLeft className="size-3.5" />
                            Back to Dashboard
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <Zap className="size-5 text-destructive" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">
                                            {conflict.description ||
                                                'Unnamed conflict'}
                                        </h1>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            ID: {conflict.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-[52px]">
                                    <ConflictStatusBadge
                                        status={conflict.status}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        Confidence: {confidencePercent}%
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                {conflict.status === 'ACTIVE' && id && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() =>
                                            acknowledge.mutate({ params: { path: { id: id! } } })
                                        }
                                        disabled={acknowledge.isPending}
                                    >
                                        <Eye className="size-3.5" />
                                        Acknowledge
                                    </Button>
                                )}
                                {(conflict.status === 'ACTIVE' ||
                                    conflict.status === 'ACKNOWLEDGED') &&
                                    id && (
                                        <Button
                                            size="sm"
                                            className="gap-2"
                                            onClick={() =>
                                                resolve.mutate({ params: { path: { id: id! } } })
                                            }
                                            disabled={resolve.isPending}
                                        >
                                            <CheckCircle className="size-3.5" />
                                            Resolve
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Claims Side-by-Side */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            Conflicting Claims
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ClaimCard
                                label="Source Claim"
                                claimId={conflict.sourceClaimId}
                                side="source"
                            />
                            <ClaimCard
                                label="Target Claim"
                                claimId={conflict.targetClaimId}
                                side="target"
                            />
                        </div>
                    </section>

                    {/* Metadata */}
                    <section className="space-y-4 pt-8 border-t">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                            Metadata
                        </h3>
                        <ConflictMetadata conflict={conflict} />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
