import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    Download,
    RefreshCw,
    Filter,
    Calendar,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    AtSign,
    ClipboardCheck,
    BookOpen,
    FileText,
    TrendingUp,
    ArrowUp,
} from 'lucide-react';

// --- Claims Data ---

type ClaimStatus = 'verified' | 'contradicted' | 'needs_review';

interface Claim {
    title: string;
    nodeId: string;
    origin: string;
    originIcon: React.ReactNode;
    status: ClaimStatus;
    confidence: number;
    lastPulse: string;
}

const claims: Claim[] = [
    {
        title: 'API uses Redis for persistence layer in staging',
        nodeId: 'KN-9283-A',
        origin: 'Slack',
        originIcon: <AtSign className="size-4" />,
        status: 'verified',
        confidence: 94,
        lastPulse: '2h ago',
    },
    {
        title: 'Postgres cluster auto-scales on CPU > 80%',
        nodeId: 'KN-4421-B',
        origin: 'Jira',
        originIcon: <ClipboardCheck className="size-4" />,
        status: 'contradicted',
        confidence: 21,
        lastPulse: '1d ago',
    },
    {
        title: 'Authentication utilizes OAuth2.1 flow',
        nodeId: 'KN-1055-C',
        origin: 'Confluence',
        originIcon: <BookOpen className="size-4" />,
        status: 'needs_review',
        confidence: 65,
        lastPulse: 'Oct 12',
    },
    {
        title: 'Data retention policy set to 7 years for PII',
        nodeId: 'KN-7782-Z',
        origin: 'Docs',
        originIcon: <FileText className="size-4" />,
        status: 'verified',
        confidence: 100,
        lastPulse: 'Just now',
    },
];

function StatusBadge({ status }: { status: ClaimStatus }) {
    if (status === 'verified') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-900">
                Verified
            </span>
        );
    }
    if (status === 'contradicted') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-900">
                Contradicted
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border">
            Needs Review
        </span>
    );
}

function ConfidenceBar({
    value,
    status,
}: {
    value: number;
    status: ClaimStatus;
}) {
    const barColor =
        status === 'contradicted'
            ? 'bg-red-400'
            : status === 'needs_review'
              ? 'bg-muted-foreground'
              : 'bg-foreground';

    return (
        <div className="flex items-center gap-2">
            <div className="w-12 bg-muted h-1.5 rounded-full overflow-hidden">
                <div
                    className={`${barColor} h-full rounded-full`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className="text-xs font-mono font-bold">{value}%</span>
        </div>
    );
}

// --- Filter Toolbar ---

function FilterToolbar() {
    return (
        <div className="bg-muted rounded-xl p-3 mb-6 flex flex-wrap items-center gap-3 border">
            <div className="flex-1 min-w-[300px] relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    className="pl-10 border-none bg-card"
                    placeholder="Filter claims by keywords..."
                />
            </div>
            <div className="flex items-center gap-2">
                <select className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring">
                    <option>All Sources</option>
                    <option>Slack</option>
                    <option>Jira</option>
                    <option>Confluence</option>
                </select>
                <select className="bg-card border-none rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring">
                    <option>Any Status</option>
                    <option>Verified</option>
                    <option>Contradicted</option>
                    <option>Needs Review</option>
                </select>
                <div className="h-8 w-px bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 text-muted-foreground"
                >
                    <Calendar className="size-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 text-muted-foreground"
                >
                    <ArrowUpDown className="size-4" />
                </Button>
            </div>
        </div>
    );
}

// --- Claims Table ---

function ClaimsTable() {
    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-sm border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Claim Identity & Logic
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Origin
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Status
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Confidence
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">
                            Last Pulse
                        </TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {claims.map((claim) => (
                        <TableRow
                            key={claim.nodeId}
                            className="group hover:bg-muted/50 transition-colors"
                        >
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">
                                        {claim.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                        Node ID: {claim.nodeId}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded bg-muted flex items-center justify-center">
                                        {claim.originIcon}
                                    </div>
                                    <span className="text-xs font-medium">
                                        {claim.origin}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={claim.status} />
                            </TableCell>
                            <TableCell>
                                <ConfidenceBar
                                    value={claim.confidence}
                                    status={claim.status}
                                />
                            </TableCell>
                            <TableCell>
                                <span className="text-xs text-muted-foreground">
                                    {claim.lastPulse}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="bg-muted px-6 py-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Showing 1-20 of 2,482 Claims
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button size="sm" className="h-7 px-2.5 text-xs font-bold">
                        1
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs font-bold"
                    >
                        2
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs font-bold"
                    >
                        3
                    </Button>
                    <span className="px-1 text-xs text-muted-foreground">
                        ...
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs font-bold"
                    >
                        124
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// --- Stats ---

interface Stat {
    label: string;
    value: string;
    suffix?: string;
    change?: { value: string; positive: boolean };
    barWidth: string;
    barColor: string;
    tag?: string;
}

const stats: Stat[] = [
    {
        label: 'Causality Conflicts',
        value: '12',
        change: { value: '4%', positive: false },
        barWidth: 'w-1/4',
        barColor: 'bg-red-500',
    },
    {
        label: 'Verification Velocity',
        value: '412',
        suffix: '/day',
        change: { value: '12%', positive: true },
        barWidth: 'w-2/3',
        barColor: 'bg-foreground',
    },
    {
        label: 'Source Entropy',
        value: 'Low',
        tag: 'Stable',
        barWidth: 'w-full',
        barColor: 'bg-muted-foreground/20',
    },
];

function StatsRow() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-card p-5 rounded-xl border shadow-sm"
                >
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                        {stat.label}
                    </p>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-black">
                            {stat.value}
                            {stat.suffix && (
                                <span className="text-sm font-medium text-muted-foreground">
                                    {stat.suffix}
                                </span>
                            )}
                        </span>
                        {stat.change && (
                            <span
                                className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                    stat.change.positive
                                        ? 'text-green-600 bg-green-50 dark:bg-green-950'
                                        : 'text-red-600 bg-red-50 dark:bg-red-950'
                                }`}
                            >
                                {stat.change.positive ? (
                                    <TrendingUp className="size-3" />
                                ) : (
                                    <ArrowUp className="size-3" />
                                )}
                                {stat.change.value}
                            </span>
                        )}
                        {stat.tag && (
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {stat.tag}
                            </span>
                        )}
                    </div>
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

// --- Main Page ---

export function ClaimsLibraryPage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory' },
                { label: 'Claims Library' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Claims Library
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Reviewing 2,482 cognitive nodes across
                                integrated systems.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="gap-2"
                            >
                                <Download className="size-3.5" />
                                Export Library
                            </Button>
                            <Button size="sm" className="gap-2">
                                <RefreshCw className="size-3.5" />
                                Re-index Sources
                            </Button>
                        </div>
                    </div>

                    {/* Filter */}
                    <FilterToolbar />

                    {/* Table */}
                    <ClaimsTable />

                    {/* Stats */}
                    <StatsRow />
                </div>
            </div>
        </AppLayout>
    );
}
