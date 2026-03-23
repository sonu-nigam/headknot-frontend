import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import { Schemas } from '@/types/api';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import {
    FileText,
    Info,
    CheckCircle,
    Code,
    Zap,
    History,
    AlertTriangle,
    Brain,
    MessageSquare,
    Ticket,
    ArrowRight,
    ExternalLink,
    Loader2,
    SearchIcon,
    Paperclip,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

// --- Causal Chain ---

interface CausalStage {
    label: string;
    title: string;
    description: string;
    sourceTag: string;
    sourceLabel: string;
    trailingIcon: React.ReactNode;
}

const causalStages: CausalStage[] = [
    {
        label: 'Requirements',
        title: 'Low-Latency Graph Traversal',
        description:
            'System must handle >10k concurrent node queries with sub-50ms response time.',
        sourceTag: 'PRD',
        sourceLabel: 'Source: Q3 Roadmap',
        trailingIcon: <Info className="size-3.5 text-muted-foreground" />,
    },
    {
        label: 'Architectural Decisions',
        title: 'Shift to In-Memory Vector Store',
        description:
            'Decision made to bypass traditional RDBMS for semantic indexing to meet latency thresholds.',
        sourceTag: 'ADR',
        sourceLabel: 'Owner: Archi-Committee',
        trailingIcon: <CheckCircle className="size-3.5 text-primary" />,
    },
    {
        label: 'Implementation',
        title: 'RedisGraph + Pinecone Hybrid',
        description:
            'Live deployment of dual-engine approach. Verified 38ms average traversal speed.',
        sourceTag: 'GIT',
        sourceLabel: 'Hash: 8f2d9c1',
        trailingIcon: <Code className="size-3.5 text-muted-foreground" />,
    },
];

function CausalChainMap() {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Causal Chain Map
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                    LATEST REVISION: V2.4
                </Badge>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-8">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />

                {causalStages.map((stage, i) => (
                    <div key={stage.label} className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-2 rounded-full bg-foreground" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                {stage.label}
                            </span>
                        </div>
                        <div
                            className={`bg-card p-5 rounded-lg shadow-sm border-l-4 ${i === 1 ? 'border-l-muted-foreground/30' : 'border-l-foreground/50'} group`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-sm font-semibold">
                                    {stage.title}
                                </h4>
                                <div className="flex items-center gap-1">
                                    <FileText className="size-3.5 text-primary cursor-pointer hover:scale-110 transition-transform" />
                                    {stage.trailingIcon}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {stage.description}
                            </p>
                            <div className="mt-4 pt-4 border-t flex gap-2 items-center">
                                <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                    {stage.sourceTag}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    {stage.sourceLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Conflict & Contradiction Log ---

interface Conflict {
    type: 'active' | 'resolved';
    label: string;
    title: string;
    description: string;
    timeAgo: string;
}

const conflicts: Conflict[] = [
    {
        type: 'active',
        label: 'Security vs. Speed',
        title: 'Row-Level Security Performance Drag',
        description:
            'RLS implementation adds 15ms overhead per query, contradicting the "High-Speed" requirement.',
        timeAgo: '2 days ago',
    },
    {
        type: 'resolved',
        label: 'Resolved',
        title: 'API Rate Limit Conflict',
        description:
            'Resolved by implementing asynchronous batching on the ingestion worker.',
        timeAgo: '1 week ago',
    },
];

function ConflictLog() {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-destructive" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Conflict & Contradiction Log
                </h3>
            </div>
            <div className="space-y-3">
                {conflicts.map((conflict) => (
                    <div
                        key={conflict.title}
                        className={`bg-muted p-4 rounded-lg flex gap-4 ${conflict.type === 'resolved' ? 'opacity-70' : ''}`}
                    >
                        <div className="shrink-0 size-8 rounded-full bg-destructive/10 flex items-center justify-center">
                            {conflict.type === 'active' ? (
                                <Zap className="size-4 text-destructive" />
                            ) : (
                                <History className="size-4 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className={`text-[10px] font-bold uppercase ${conflict.type === 'active' ? 'text-destructive' : 'text-muted-foreground'}`}
                                >
                                    {conflict.label}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    • {conflict.timeAgo}
                                </span>
                            </div>
                            <h5 className="text-sm font-semibold mb-1">
                                {conflict.title}
                            </h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {conflict.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Decision Memory (Evidence) ---

interface Evidence {
    icon: React.ReactNode;
    iconBg: string;
    source: string;
    date: string;
    quote: string;
    isQuote: boolean;
    author?: string;
    authorRole?: string;
    hookLabel?: string;
    attachment?: string;
}

const evidenceItems: Evidence[] = [
    {
        icon: <MessageSquare className="size-3 text-white" />,
        iconBg: 'bg-zinc-900',
        source: '#arch-discussions',
        date: 'Mar 12, 14:22',
        quote: '"If we don\'t switch to a vector-first approach now, we\'ll hit a wall with the causality mapping engine by June..."',
        isQuote: true,
        author: 'Sarah K. (CTO)',
        hookLabel: 'Decision Hook: V1.2',
    },
    {
        icon: <Ticket className="size-3 text-white" />,
        iconBg: 'bg-blue-600',
        source: 'HK-1092: Engine Pivot',
        date: 'Mar 14, 09:10',
        quote: 'Attached: Performance benchmark reports comparing PostgreSQL vs Neo4j vs Pinecone under heavy load.',
        isQuote: false,
        attachment: 'ATTACHMENT_12.PDF',
    },
];

function DecisionMemory() {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <Brain className="size-5 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Decision Memory (Evidence)
                </h3>
            </div>
            <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
                <div className="p-4 border-b flex items-center justify-between bg-muted">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Linked Sources
                    </span>
                    <button className="text-[10px] font-bold text-primary flex items-center gap-1 group">
                        VIEW ALL{' '}
                        <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="divide-y">
                    {evidenceItems.map((item) => (
                        <div
                            key={item.source}
                            className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`size-6 rounded ${item.iconBg} flex items-center justify-center`}
                                    >
                                        {item.icon}
                                    </div>
                                    <span className="text-xs font-medium">
                                        {item.source}
                                    </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    {item.date}
                                </span>
                            </div>
                            <p
                                className={`text-xs text-muted-foreground line-clamp-2 mb-3 ${item.isQuote ? 'italic' : ''}`}
                            >
                                {item.quote}
                            </p>
                            <div className="flex items-center justify-between">
                                {item.author ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <div className="size-4 rounded-full bg-muted" />
                                            <span className="text-[10px] font-semibold">
                                                {item.author}
                                            </span>
                                        </div>
                                        {item.hookLabel && (
                                            <span className="text-[9px] font-bold text-primary uppercase">
                                                {item.hookLabel}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    item.attachment && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-[9px] font-bold">
                                            <Paperclip className="size-2.5" />
                                            {item.attachment}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Footer Stats ---

interface Stat {
    label: string;
    value: string;
    suffix?: string;
    isError?: boolean;
}

const stats: Stat[] = [
    { label: 'Total Reasoning Depth', value: '12', suffix: 'Layers' },
    { label: 'Causal Confidence', value: '94', suffix: '%' },
    { label: 'Active Conflicts', value: '2', isError: true },
    { label: 'Knowledge Nodes', value: '1,429' },
];

function FooterStats() {
    return (
        <section className="pt-8 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-4 bg-muted rounded-lg">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                            {stat.label}
                        </p>
                        <p
                            className={`text-2xl font-bold tracking-tight ${stat.isError ? 'text-destructive' : ''}`}
                        >
                            {stat.value}
                            {stat.suffix && (
                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                    {stat.suffix}
                                </span>
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Main Page ---

export function CausalResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [limit, setLimit] = useState(10);

    const { data: searchResults, isLoading } = useQuery({
        ...searchQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            query,
            limit,
        }),
        enabled: !!query && !!selectedWorkspaceId,
    });

    const results = searchResults?.items ?? [];

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Causal Results' },
            ]}
        >
            <div className="flex-1 overflow-y-auto relative">
                <div className="p-8 pb-32 max-w-7xl w-full mx-auto space-y-10">
                    {/* Page Header */}
                    <section>
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-2">
                            Causal Results (Reasoning Intent)
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Deconstructing the underlying logic behind the
                            architecture pivot. Mapping causal relationships
                            from initial requirements to the final
                            implementation state.
                        </p>
                    </section>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && results.length === 0 && query && (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <SearchIcon className="size-10 mb-4" />
                            <p className="text-sm font-medium">
                                No causal chains found for &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-xs mt-1">
                                Try a different reasoning query.
                            </p>
                        </div>
                    )}

                    {/* Causal Chain Map */}
                    <CausalChainMap />

                    {/* Two Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <ConflictLog />
                        <DecisionMemory />
                    </div>

                    {/* Footer Stats */}
                    <FooterStats />
                </div>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
