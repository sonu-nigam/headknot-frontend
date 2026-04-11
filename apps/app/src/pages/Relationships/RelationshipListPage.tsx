import { useState, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    Loader2,
    Filter,
    Plus,
    ThumbsUp,
    ThumbsDown,
    Link2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { Schemas } from '@/types/api';
import { api, $api } from '@workspace/api-client';
import { useSubmitFeedback } from '@/hooks/relationships/useSubmitFeedback';

// --- Types ---

type RelationshipType = NonNullable<Schemas['RelationshipResponse']['type']>;
type RelationshipStatus = NonNullable<Schemas['RelationshipResponse']['status']>;

// --- Type Badge ---

const TYPE_COLORS: Record<RelationshipType, string> = {
    supports:
        'bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900',
    contradicts:
        'bg-red-50 text-red-700 border-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900',
    references:
        'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900',
    derives_from:
        'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900',
    related:
        'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
};

function TypeBadge({ type }: { type?: RelationshipType }) {
    if (!type) return null;
    const colors = TYPE_COLORS[type] ?? TYPE_COLORS.related;
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors}`}
        >
            {type.replace('_', ' ')}
        </span>
    );
}

// --- Status Badge ---

function StatusBadge({ status }: { status?: RelationshipStatus }) {
    if (status === 'CONFIRMED') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900">
                Confirmed
            </span>
        );
    }
    if (status === 'REJECTED') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900">
                Rejected
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900">
            Pending
        </span>
    );
}

// --- Origin Badge ---

function OriginBadge({ source }: { source?: string }) {
    if (source === 'USER') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-900">
                User
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border">
            System
        </span>
    );
}

// --- Confidence Bar ---

function ConfidenceBar({ value }: { value?: number }) {
    const percent = Math.round((value ?? 0) * 100);
    const barColor =
        percent >= 70
            ? 'bg-green-400'
            : percent >= 40
              ? 'bg-yellow-400'
              : 'bg-red-400';

    return (
        <div className="flex items-center gap-2">
            <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden">
                <div
                    className={`${barColor} h-full rounded-full`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <span className="text-xs font-mono font-bold">{percent}%</span>
        </div>
    );
}

// --- Claim Text Cell ---

function ClaimTextCell({ claimId }: { claimId?: string }) {
    const { data: claim, isLoading } = $api.useQuery(
        "get",
        "/knowledge/claims/{claimId}",
        { params: { path: { claimId: claimId ?? '' } } },
        { enabled: !!claimId },
    );

    if (isLoading) {
        return (
            <span className="text-xs text-muted-foreground italic">
                Loading...
            </span>
        );
    }

    const text = claim?.claimText ?? claimId?.slice(0, 8) ?? '--';
    return (
        <span className="text-sm" title={text}>
            {text.length > 60 ? text.slice(0, 60) + '...' : text}
        </span>
    );
}

// --- Stats Panel ---

function StatsPanel({
    relationships,
}: {
    relationships: Schemas['RelationshipResponse'][];
}) {
    const total = relationships.length;
    const confirmed = relationships.filter(
        (r) => r.status === 'CONFIRMED',
    ).length;
    const rejected = relationships.filter(
        (r) => r.status === 'REJECTED',
    ).length;
    const pending = total - confirmed - rejected;

    const stats = [
        { label: 'Total', value: total },
        { label: 'Confirmed', value: confirmed },
        { label: 'Rejected', value: rejected },
        { label: 'Pending', value: pending },
    ];

    return (
        <div className="flex items-center gap-4">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-card border rounded-lg px-3 py-2 text-center"
                >
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {s.label}
                    </p>
                    <span className="text-lg font-black">{s.value}</span>
                </div>
            ))}
        </div>
    );
}

// --- Constants ---

const PAGE_SIZE = 20;
const MAX_ENTITIES = 20;

// --- Main Page ---

export function RelationshipListPage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);

    // 1. Fetch entities
    const { data: entities, isLoading: loadingEntities } = $api.useQuery(
        "get",
        "/knowledge/entities",
        { params: { query: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );

    const limitedEntities = useMemo(
        () => (entities ?? []).slice(0, MAX_ENTITIES),
        [entities],
    );

    // 2. Fetch claims for each entity
    const claimQueries = useQueries({
        queries: limitedEntities.map((entity) => ({
            queryKey: ["get", "/knowledge/claims", { params: { query: { entityId: entity.id ?? '' } } }] as const,
            queryFn: async () => {
                const { data, error } = await api.GET("/knowledge/claims", { params: { query: { entityId: entity.id ?? '' } } });
                if (error) throw error;
                return data;
            },
            enabled: !!entity.id,
        })),
    });

    const allClaims = useMemo(
        () => claimQueries.flatMap((q) => q.data ?? []),
        [claimQueries],
    );

    const uniqueClaimIds = useMemo(() => {
        const ids = new Set<string>();
        allClaims.forEach((c) => {
            if (c.id) ids.add(c.id);
        });
        return Array.from(ids);
    }, [allClaims]);

    // 3. Fetch relationships for each claim
    const relationshipQueries = useQueries({
        queries: uniqueClaimIds.map((claimId) => ({
            queryKey: ["get", "/relationships", { params: { query: { claimId } } }] as const,
            queryFn: async () => {
                const { data, error } = await api.GET("/relationships", { params: { query: { claimId } } });
                if (error) throw error;
                return data;
            },
            enabled: !!claimId,
        })),
    });

    const loadingClaims = claimQueries.some((q) => q.isLoading);
    const loadingRelationships = relationshipQueries.some((q) => q.isLoading);
    const isLoading = loadingEntities || loadingClaims || loadingRelationships;

    // Deduplicate relationships by id
    const allRelationships = useMemo(() => {
        const seen = new Set<string>();
        const result: Schemas['RelationshipResponse'][] = [];
        relationshipQueries.forEach((q) => {
            (q.data ?? []).forEach((r) => {
                if (r.id && !seen.has(r.id)) {
                    seen.add(r.id);
                    result.push(r);
                }
            });
        });
        return result;
    }, [relationshipQueries]);

    // Apply filters
    const filteredRelationships = useMemo(() => {
        let list = allRelationships;
        if (typeFilter) {
            list = list.filter((r) => r.type === typeFilter);
        }
        if (statusFilter) {
            list = list.filter((r) => {
                if (statusFilter === 'PENDING')
                    return r.status === 'SUGGESTED' || !r.status;
                return r.status === statusFilter;
            });
        }
        return list;
    }, [allRelationships, typeFilter, statusFilter]);

    // Pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredRelationships.length / PAGE_SIZE),
    );
    const pagedRelationships = filteredRelationships.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE,
    );

    const feedback = useSubmitFeedback();

    const handleFeedback = (
        relationshipId: string,
        vote: 'POSITIVE' | 'NEGATIVE',
    ) => {
        feedback.mutate({
            params: { path: { relationshipId } },
            body: { action: vote === 'POSITIVE' ? 'CONFIRM' : 'REJECT' },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Relationships' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Relationships
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Connections between claims across your knowledge
                                base.
                            </p>
                        </div>
                        {!isLoading && allRelationships.length > 0 && (
                            <StatsPanel relationships={allRelationships} />
                        )}
                    </div>

                    {/* Filter row */}
                    <div className="bg-muted rounded-xl p-3 flex flex-wrap items-center gap-3 border">
                        <div className="flex items-center gap-2">
                            <Filter className="size-4 text-muted-foreground" />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    setPage(0);
                                }}
                                className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                            >
                                <option value="">All Types</option>
                                <option value="supports">Supports</option>
                                <option value="contradicts">Contradicts</option>
                                <option value="references">References</option>
                                <option value="derives_from">
                                    Derives From
                                </option>
                                <option value="related">Related</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(0);
                                }}
                                className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                            >
                                <option value="">All Statuses</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div className="ml-auto">
                            <Button variant="default" size="sm" className="gap-2">
                                <Plus className="size-3.5" />
                                New Connection
                            </Button>
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredRelationships.length === 0 && (
                        <div className="text-center py-16 space-y-3">
                            <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                                <Link2 className="size-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    No relationships found
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {typeFilter || statusFilter
                                        ? 'Try adjusting your filters.'
                                        : 'Relationships will appear as the system discovers connections between claims.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && pagedRelationships.length > 0 && (
                        <div className="bg-card rounded-xl overflow-hidden shadow-sm border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Source Claim
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Type
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Target Claim
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Confidence
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                                            Origin
                                        </TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pagedRelationships.map((rel) => (
                                        <TableRow
                                            key={rel.id}
                                            className="group hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="max-w-[200px]">
                                                <ClaimTextCell
                                                    claimId={rel.sourceClaimId}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TypeBadge
                                                    type={
                                                        rel.type as RelationshipType
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <ClaimTextCell
                                                    claimId={rel.targetClaimId}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <ConfidenceBar
                                                    value={rel.confidence}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <OriginBadge
                                                    source={rel.source}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                        title="Positive feedback"
                                                        disabled={
                                                            feedback.isPending
                                                        }
                                                        onClick={() =>
                                                            rel.id &&
                                                            handleFeedback(
                                                                rel.id,
                                                                'POSITIVE',
                                                            )
                                                        }
                                                    >
                                                        <ThumbsUp className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                        title="Negative feedback"
                                                        disabled={
                                                            feedback.isPending
                                                        }
                                                        onClick={() =>
                                                            rel.id &&
                                                            handleFeedback(
                                                                rel.id,
                                                                'NEGATIVE',
                                                            )
                                                        }
                                                    >
                                                        <ThumbsDown className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Showing{' '}
                                {page * PAGE_SIZE + 1}--
                                {Math.min(
                                    (page + 1) * PAGE_SIZE,
                                    filteredRelationships.length,
                                )}{' '}
                                of {filteredRelationships.length}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                    disabled={page === 0}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <span className="text-xs font-medium">
                                    {page + 1} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
