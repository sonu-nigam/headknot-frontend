import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    User,
    MapPin,
    Building2,
    Lightbulb,
    Cpu,
    CalendarDays,
    CircleDot,
    Share2,
    Loader2,
    ShieldCheck,
    Clock,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { api, $api } from '@workspace/api-client';
import { Schemas } from '@/types/api';

// --- Helpers ---

type EntityType = NonNullable<Schemas['EntityResponse']['entityType']>;
type LifecycleStatus = NonNullable<Schemas['ClaimResponse']['lifecycleStatus']>;
type RelType = NonNullable<Schemas['RelationshipResponse']['type']>;

function entityTypeIcon(type?: EntityType) {
    const cls = 'size-4';
    switch (type) {
        case 'person':
            return <User className={cls} />;
        case 'place':
            return <MapPin className={cls} />;
        case 'organization':
            return <Building2 className={cls} />;
        case 'concept':
            return <Lightbulb className={cls} />;
        case 'technology':
            return <Cpu className={cls} />;
        case 'event':
            return <CalendarDays className={cls} />;
        default:
            return <CircleDot className={cls} />;
    }
}

function entityTypeBadgeColor(type?: EntityType) {
    switch (type) {
        case 'person':
            return 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900';
        case 'place':
            return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900';
        case 'organization':
            return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900';
        case 'concept':
            return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900';
        case 'technology':
            return 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-900';
        case 'event':
            return 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-900';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
}

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
    person: 'Person',
    place: 'Place',
    organization: 'Organization',
    concept: 'Concept',
    technology: 'Technology',
    event: 'Event',
    other: 'Other',
};

function lifecycleStatusBadge(status?: LifecycleStatus) {
    const base =
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border';
    switch (status) {
        case 'ACTIVE':
            return (
                <span
                    className={`${base} bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900`}
                >
                    Active
                </span>
            );
        case 'DISPUTED':
            return (
                <span
                    className={`${base} bg-red-50 text-red-700 border-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900`}
                >
                    Disputed
                </span>
            );
        case 'SUPERSEDED':
            return (
                <span
                    className={`${base} bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900`}
                >
                    Superseded
                </span>
            );
        case 'ARCHIVED':
            return (
                <span
                    className={`${base} bg-muted text-muted-foreground border-border`}
                >
                    Archived
                </span>
            );
        case 'DRAFT':
            return (
                <span
                    className={`${base} bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900`}
                >
                    Draft
                </span>
            );
        default:
            return null;
    }
}

function relTypeBadge(type?: RelType) {
    const base =
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border';
    switch (type) {
        case 'supports':
            return (
                <span
                    className={`${base} bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900`}
                >
                    Supports
                </span>
            );
        case 'contradicts':
            return (
                <span
                    className={`${base} bg-red-50 text-red-700 border-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900`}
                >
                    Contradicts
                </span>
            );
        case 'references':
            return (
                <span
                    className={`${base} bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900`}
                >
                    References
                </span>
            );
        case 'derives_from':
            return (
                <span
                    className={`${base} bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900`}
                >
                    Derives From
                </span>
            );
        case 'related':
            return (
                <span className={`${base} bg-muted text-muted-foreground`}>
                    Related
                </span>
            );
        default:
            return null;
    }
}

function formatDate(dateStr?: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatDateTime(dateStr?: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

// --- Confidence Bar ---

function ConfidenceBar({ value }: { value?: number }) {
    const percent = Math.round((value ?? 0) * 100);
    const barColor =
        percent >= 70
            ? 'bg-foreground'
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

// --- Claims Tab ---

function ClaimsTab({ claims }: { claims: Schemas['ClaimResponse'][] }) {
    if (claims.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                No claims associated with this entity.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {claims.map((claim) => (
                <div
                    key={claim.id}
                    className="bg-card border rounded-xl p-4 space-y-3"
                >
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-medium leading-relaxed">
                            {claim.claimText || claim.predicate || '—'}
                        </p>
                        {lifecycleStatusBadge(claim.lifecycleStatus)}
                    </div>
                    <div className="flex items-center gap-4">
                        <ConfidenceBar value={claim.confidence} />
                        <span className="text-xs text-muted-foreground">
                            {formatDate(claim.createdAt)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Relationships Tab ---

function RelationshipsTab({
    claims,
}: {
    claims: Schemas['ClaimResponse'][];
}) {
    const claimIds = claims.map((c) => c.id).filter(Boolean) as string[];

    const relQueries = useQueries({
        queries: claimIds.map((claimId) =>
            ({
                queryKey: ["get", "/relationships", { params: { query: { claimId } } }] as const,
                queryFn: async () => {
                    const { data, error } = await api.GET("/relationships", { params: { query: { claimId } } });
                    if (error) throw error;
                    return data;
                },
            }),
        ),
    });

    const allRelationships = useMemo(() => {
        const rels: Schemas['RelationshipResponse'][] = [];
        const seenIds = new Set<string>();
        for (const q of relQueries) {
            for (const r of q.data ?? []) {
                if (r.id && !seenIds.has(r.id)) {
                    seenIds.add(r.id);
                    rels.push(r);
                }
            }
        }
        return rels;
    }, [relQueries]);

    const isLoading = relQueries.some((q) => q.isLoading);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (allRelationships.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                No relationships found for this entity's claims.
            </div>
        );
    }

    return (
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
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allRelationships.map((rel) => (
                        <TableRow
                            key={rel.id}
                            className="hover:bg-muted/50 transition-colors"
                        >
                            <TableCell>
                                <span className="text-xs font-mono text-muted-foreground">
                                    {rel.sourceClaimId?.slice(0, 8)}...
                                </span>
                            </TableCell>
                            <TableCell>{relTypeBadge(rel.type)}</TableCell>
                            <TableCell>
                                <span className="text-xs font-mono text-muted-foreground">
                                    {rel.targetClaimId?.slice(0, 8)}...
                                </span>
                            </TableCell>
                            <TableCell>
                                <ConfidenceBar value={rel.confidence} />
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-muted text-muted-foreground">
                                    {rel.status ?? '—'}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// --- Timeline Tab ---

function TimelineTab({ entityId }: { entityId: string }) {
    const { data: events, isLoading } = $api.useQuery("get", "/timeline", {
        params: { query: { objectType: 'ENTITY', objectId: entityId } },
    }, { enabled: !!entityId });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                No timeline events yet.
            </div>
        );
    }

    return (
        <div className="relative pl-6 space-y-0">
            {/* Vertical line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />

            {events.map((event, i) => (
                <div key={event.id ?? i} className="relative pb-6 last:pb-0">
                    {/* Dot */}
                    <div className="absolute -left-3.5 top-1.5 size-3 rounded-full bg-muted border-2 border-border" />
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold">
                                {event.eventType ?? 'Event'}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {formatDateTime(event.timestamp)}
                            </span>
                        </div>
                        {event.actorName && (
                            <p className="text-xs text-muted-foreground mt-1">
                                by {event.actorName}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Stats Sidebar ---

function StatsSidebar({ claims }: { claims: Schemas['ClaimResponse'][] }) {
    const total = claims.length;
    const supporting = claims.filter(
        (c) => c.polarity === 'positive' || c.polarity === 'POSITIVE',
    ).length;
    const contradicted = claims.filter(
        (c) => c.polarity === 'negative' || c.polarity === 'NEGATIVE',
    ).length;

    const sortedByDate = [...claims]
        .filter((c) => c.createdAt)
        .sort(
            (a, b) =>
                new Date(a.createdAt!).getTime() -
                new Date(b.createdAt!).getTime(),
        );
    const firstSeen = sortedByDate[0]?.createdAt;

    const stats = [
        {
            label: 'Total Claims',
            value: String(total),
            icon: <ShieldCheck className="size-4 text-muted-foreground" />,
        },
        {
            label: 'Supporting',
            value: String(supporting),
            icon: <TrendingUp className="size-4 text-green-500" />,
        },
        {
            label: 'Contradicted',
            value: String(contradicted),
            icon: <TrendingDown className="size-4 text-red-500" />,
        },
        {
            label: 'First Seen',
            value: formatDate(firstSeen),
            icon: <Clock className="size-4 text-muted-foreground" />,
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Entity Stats
            </h3>
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-card border rounded-xl p-4 flex items-center gap-3"
                >
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {stat.label}
                        </p>
                        <p className="text-lg font-black">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Main Page ---

export function EntityDetailPage() {
    const { entityId } = useParams<{ entityId: string }>();
    const navigate = useNavigate();

    const { data: entity, isLoading: entityLoading } = $api.useQuery(
        "get",
        "/knowledge/entities/{entityId}",
        { params: { path: { entityId: entityId ?? '' } } },
        { enabled: !!entityId },
    );

    const { data: aliases } = $api.useQuery(
        "get",
        "/knowledge/entities/{entityId}/aliases",
        { params: { path: { entityId: entityId ?? '' } } },
        { enabled: !!entityId },
    );

    const { data: claims, isLoading: claimsLoading } = $api.useQuery(
        "get",
        "/knowledge/claims",
        { params: { query: { entityId: entityId ?? '' } } },
        { enabled: !!entityId },
    );

    const claimsList = claims ?? [];
    const aliasList = aliases ?? entity?.aliases ?? [];

    // Count relationships for tab badge
    const claimIds = claimsList
        .map((c) => c.id)
        .filter(Boolean) as string[];
    const relQueries = useQueries({
        queries: claimIds.map((claimId) =>
            ({
                queryKey: ["get", "/relationships", { params: { query: { claimId } } }] as const,
                queryFn: async () => {
                    const { data, error } = await api.GET("/relationships", { params: { query: { claimId } } });
                    if (error) throw error;
                    return data;
                },
            }),
        ),
    });
    const relCount = useMemo(() => {
        const seenIds = new Set<string>();
        for (const q of relQueries) {
            for (const r of q.data ?? []) {
                if (r.id) seenIds.add(r.id);
            }
        }
        return seenIds.size;
    }, [relQueries]);

    if (entityLoading) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Entities', href: '/entities' },
                    { label: 'Loading...' },
                ]}
            >
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Entities', href: '/entities' },
                { label: entity?.name ?? 'Entity' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Entity Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                                    {entityTypeIcon(entity?.entityType)}
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {entity?.name ?? 'Unknown Entity'}
                                </h1>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${entityTypeBadgeColor(entity?.entityType)}`}
                                >
                                    {ENTITY_TYPE_LABELS[
                                        entity?.entityType ?? 'other'
                                    ] ?? 'Other'}
                                </span>
                            </div>
                            {aliasList.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-muted-foreground">
                                        Also known as:
                                    </span>
                                    {aliasList.map((alias, i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-muted px-2 py-0.5 rounded font-medium"
                                        >
                                            {alias}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate('/knowledge-graph')}
                        >
                            <Share2 className="size-3.5" />
                            View in Graph
                        </Button>
                    </div>

                    {/* Content + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
                        {/* Tabs */}
                        <Tabs defaultValue="claims" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="claims">
                                    Claims ({claimsList.length})
                                </TabsTrigger>
                                <TabsTrigger value="relationships">
                                    Relationships ({relCount})
                                </TabsTrigger>
                                <TabsTrigger value="timeline">
                                    Timeline
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="claims">
                                {claimsLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <ClaimsTab claims={claimsList} />
                                )}
                            </TabsContent>

                            <TabsContent value="relationships">
                                <RelationshipsTab claims={claimsList} />
                            </TabsContent>

                            <TabsContent value="timeline">
                                <TimelineTab entityId={entityId ?? ''} />
                            </TabsContent>
                        </Tabs>

                        {/* Sidebar Stats */}
                        <div className="hidden lg:block">
                            <StatsSidebar claims={claimsList} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
