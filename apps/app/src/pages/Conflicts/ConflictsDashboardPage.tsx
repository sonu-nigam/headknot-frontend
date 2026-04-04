import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
    AlertTriangle,
    Zap,
    History,
    CheckCircle,
    ChevronRight,
    Loader2,
    RefreshCw,
    Filter,
    Eye,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { Schemas } from '@/types/api';
import { conflictsQueryOptions } from '@/query/options/conflicts';
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

// --- Confidence Bar ---

function ConfidenceBar({ value }: { value?: number }) {
    const percent = Math.round((value ?? 0) * 100);
    const barColor = percent >= 70 ? 'bg-red-400' : percent >= 40 ? 'bg-yellow-400' : 'bg-muted-foreground';

    return (
        <div className="flex items-center gap-2">
            <div className="w-12 bg-muted h-1.5 rounded-full overflow-hidden">
                <div
                    className={`${barColor} h-full rounded-full`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <span className="text-xs font-mono font-bold">{percent}%</span>
        </div>
    );
}

// --- Stats Row ---

function ConflictStatsRow({
    conflicts,
}: {
    conflicts?: Schemas['ConflictResponse'][];
}) {
    const active = conflicts?.filter((c) => c.status === 'ACTIVE').length ?? 0;
    const acknowledged = conflicts?.filter((c) => c.status === 'ACKNOWLEDGED').length ?? 0;
    const resolved = conflicts?.filter((c) => c.status === 'RESOLVED').length ?? 0;

    const stats = [
        {
            label: 'Active Conflicts',
            value: String(active),
            barWidth: active > 0 ? 'w-1/3' : 'w-0',
            barColor: 'bg-red-500',
        },
        {
            label: 'Acknowledged',
            value: String(acknowledged),
            barWidth: acknowledged > 0 ? 'w-1/2' : 'w-0',
            barColor: 'bg-yellow-500',
        },
        {
            label: 'Resolved',
            value: String(resolved),
            barWidth: resolved > 0 ? 'w-2/3' : 'w-0',
            barColor: 'bg-green-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-card p-5 rounded-xl border shadow-sm"
                >
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                        {stat.label}
                    </p>
                    <span className="text-3xl font-black">{stat.value}</span>
                    <div className="mt-4 flex gap-1 h-1">
                        <div
                            className={`${stat.barColor} ${stat.barWidth} rounded-full`}
                        />
                        <div className="bg-muted flex-1 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Filter Toolbar ---

function ConflictFilterToolbar({
    status,
    onStatusChange,
}: {
    status: string;
    onStatusChange: (value: string) => void;
}) {
    return (
        <div className="bg-muted rounded-xl p-3 flex flex-wrap items-center gap-3 border">
            <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ACKNOWLEDGED">Acknowledged</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
            </div>
        </div>
    );
}

// --- Conflicts Table ---

function ConflictsTable({
    conflicts,
    onAcknowledge,
    onResolve,
    onNavigate,
}: {
    conflicts: Schemas['ConflictResponse'][];
    onAcknowledge: (id: string) => void;
    onResolve: (id: string) => void;
    onNavigate: (id: string) => void;
}) {
    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-sm border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Conflict
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Status
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Confidence
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Detected
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {conflicts.map((conflict) => (
                        <TableRow
                            key={conflict.id}
                            className="group hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => conflict.id && onNavigate(conflict.id)}
                        >
                            <TableCell>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 size-8 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                                        {conflict.status === 'ACTIVE' ? (
                                            <Zap className="size-4 text-destructive" />
                                        ) : conflict.status === 'RESOLVED' ? (
                                            <CheckCircle className="size-4 text-green-500" />
                                        ) : (
                                            <History className="size-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">
                                            {conflict.description || 'Unnamed conflict'}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                            ID: {conflict.id?.slice(0, 8)}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <ConflictStatusBadge status={conflict.status} />
                            </TableCell>
                            <TableCell>
                                <ConfidenceBar value={conflict.confidence} />
                            </TableCell>
                            <TableCell>
                                <span className="text-xs text-muted-foreground">
                                    {conflict.createdAt
                                        ? formatDistanceToNow(
                                              new Date(conflict.createdAt),
                                              { addSuffix: true },
                                          )
                                        : '—'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div
                                    className="flex items-center justify-end gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {conflict.status === 'ACTIVE' && conflict.id && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                                onAcknowledge(conflict.id!)
                                            }
                                        >
                                            <Eye className="size-3 mr-1" />
                                            Acknowledge
                                        </Button>
                                    )}
                                    {(conflict.status === 'ACTIVE' ||
                                        conflict.status === 'ACKNOWLEDGED') &&
                                        conflict.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() =>
                                                    onResolve(conflict.id!)
                                                }
                                            >
                                                <CheckCircle className="size-3 mr-1" />
                                                Resolve
                                            </Button>
                                        )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                                        onClick={() =>
                                            conflict.id &&
                                            onNavigate(conflict.id)
                                        }
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// --- Main Page ---

export function ConflictsDashboardPage() {
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [statusFilter, setStatusFilter] = useState('');

    const {
        data: conflicts,
        isLoading,
        refetch,
    } = useQuery({
        ...conflictsQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            status: statusFilter || undefined,
        }),
        enabled: !!selectedWorkspaceId,
    });

    const acknowledge = useAcknowledgeConflict();
    const resolve = useResolveConflict();

    // For stats, fetch all conflicts (unfiltered)
    const { data: allConflicts } = useQuery({
        ...conflictsQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
        }),
        enabled: !!selectedWorkspaceId,
    });

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Conflicts' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Contradiction Dashboard
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Surfacing inconsistencies across your knowledge
                                base.
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={() => refetch()}
                        >
                            <RefreshCw className="size-3.5" />
                            Refresh
                        </Button>
                    </div>

                    {/* Stats */}
                    <ConflictStatsRow conflicts={allConflicts} />

                    {/* Filter */}
                    <ConflictFilterToolbar
                        status={statusFilter}
                        onStatusChange={setStatusFilter}
                    />

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && (!conflicts || conflicts.length === 0) && (
                        <div className="text-center py-16 space-y-3">
                            <div className="size-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
                                <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    No contradictions found
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Your knowledge base is consistent. System is
                                    healthy.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && conflicts && conflicts.length > 0 && (
                        <ConflictsTable
                            conflicts={conflicts}
                            onAcknowledge={(id) => acknowledge.mutate(id)}
                            onResolve={(id) => resolve.mutate(id)}
                            onNavigate={(id) => navigate(`/conflicts/${id}`)}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
