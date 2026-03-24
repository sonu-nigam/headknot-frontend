import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import {
    Sparkles,
    MessageSquare,
    FileText,
    Terminal,
    Filter,
    Plus,
    History,
    CheckCircle,
    Layers,
    Cpu,
    Zap,
    TrendingUp,
    ExternalLink,
    Server,
    Database as DatabaseIcon,
} from 'lucide-react';

// --- Live Ingestion Stream ---

interface StreamItem {
    icon: React.ReactNode;
    source: string;
    timeAgo: string;
    text: string;
    dimmed?: boolean;
}

const streamItems: StreamItem[] = [
    {
        icon: <MessageSquare className="size-3.5 text-muted-foreground" />,
        source: '#engineering-core',
        timeAgo: '2m ago',
        text: '"The current Redis cluster is peaking at 90% CPU. We need to migrate the session store to a dedicated instance by Friday."',
    },
    {
        icon: <FileText className="size-3.5 text-muted-foreground" />,
        source: 'Architecture_v4.pdf',
        timeAgo: '5m ago',
        text: '"All microservices must implement Circuit Breaker patterns to ensure fault tolerance in the Headknot gateway..."',
    },
    {
        icon: <Terminal className="size-3.5 text-muted-foreground" />,
        source: 'GitHub PR #882',
        timeAgo: '12m ago',
        text: '"Modified the vector embedding pipeline to use OpenAI text-embedding-3-small for 40% cost reduction."',
    },
    {
        icon: <MessageSquare className="size-3.5 text-muted-foreground" />,
        source: '#product-sync',
        timeAgo: '',
        text: '"Q3 roadmap focuses heavily on multi-agent collaboration and real-time claim verification latency."',
        dimmed: true,
    },
];

function LiveIngestionStream() {
    return (
        <section className="col-span-12 lg:col-span-4 bg-card border rounded-lg overflow-hidden flex flex-col h-[700px] shadow-sm">
            <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Live Ingestion
                </h2>
                <Badge variant="outline" className="text-[10px]">
                    142 eps
                </Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {streamItems.map((item) => (
                    <div
                        key={item.source}
                        className={`p-3 bg-card border rounded-md hover:border-border/80 transition-all cursor-pointer shadow-sm ${item.dimmed ? 'opacity-60' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                {item.icon}
                                <span className="text-[10px] font-bold text-muted-foreground">
                                    {item.source}
                                </span>
                            </div>
                            {item.timeAgo && (
                                <span className="text-[10px] text-muted-foreground">
                                    {item.timeAgo}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Claim Workbench ---

function ClaimWorkbench() {
    return (
        <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="size-9 bg-muted border rounded flex items-center justify-center">
                        <Sparkles className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold">Claim Workbench</h2>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            ACTIVE DECOMPOSITION:{' '}
                            <code className="font-mono bg-muted px-1 rounded text-foreground">
                                #eng-core:21:44
                            </code>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                            Confidence
                        </p>
                        <p className="text-xl font-black tracking-tighter">
                            0.982
                        </p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <History className="size-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Raw Source Context */}
                <div className="bg-muted rounded-md p-5 border">
                    <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        Raw Source Context
                    </h3>
                    <p className="text-lg font-medium leading-relaxed">
                        &ldquo;The{' '}
                        <span className="bg-muted-foreground/10 px-1 rounded border-b border-foreground">
                            API
                        </span>{' '}
                        uses{' '}
                        <span className="bg-muted-foreground/10 px-1 rounded border-b border-foreground">
                            Redis
                        </span>{' '}
                        for session persistence, which is causing{' '}
                        <span className="bg-muted-foreground/10 px-1 rounded border-b border-foreground">
                            latency spikes
                        </span>{' '}
                        during peak traffic hours.&rdquo;
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Atomic Claims */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle className="size-3.5" />
                            Atomic Claims
                        </h4>
                        <div className="space-y-1.5">
                            <div className="px-3 py-2 bg-card border rounded flex items-center justify-between group hover:border-foreground/20 transition-colors">
                                <span className="text-xs font-medium">
                                    API depends on Redis
                                </span>
                                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="px-3 py-2 bg-card border rounded flex items-center justify-between group hover:border-foreground/20 transition-colors">
                                <span className="text-xs font-medium">
                                    Redis manages session persistence
                                </span>
                                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="px-3 py-2 bg-card border-l-2 border-l-foreground border rounded flex items-center justify-between group shadow-sm">
                                <span className="text-xs font-semibold">
                                    Redis performance affects latency
                                </span>
                                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    {/* Linked Entities */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Layers className="size-3.5" />
                            Linked Entities
                        </h4>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between px-3 py-2 bg-muted rounded border">
                                <div className="flex items-center gap-2">
                                    <Server className="size-4 text-muted-foreground" />
                                    <span className="text-xs font-bold">
                                        API Gateway
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                    Service
                                </span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 bg-muted rounded border">
                                <div className="flex items-center gap-2">
                                    <Cpu className="size-4 text-muted-foreground" />
                                    <span className="text-xs font-bold">
                                        Redis Cluster
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                    Resource
                                </span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 bg-muted rounded border">
                                <div className="flex items-center gap-2">
                                    <Zap className="size-4 text-muted-foreground" />
                                    <span className="text-xs font-bold">
                                        Latency Spike
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                    Event
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-10 pt-6 border-t flex justify-end gap-3">
                <Button variant="ghost" className="text-xs">
                    Discard Draft
                </Button>
                <Button className="text-xs">
                    Commit to Knowledge Graph
                </Button>
            </div>
        </div>
    );
}

// --- Metrics ---

interface Metric {
    label: string;
    value: string;
    suffix?: string;
    extra?: React.ReactNode;
}

const metrics: Metric[] = [
    {
        label: 'Ingestion Speed',
        value: '1.2GB',
        suffix: '/ HR',
        extra: (
            <div className="mt-4 flex gap-1 h-6 items-end">
                <div className="w-full bg-muted h-1/3 rounded-t-sm" />
                <div className="w-full bg-muted-foreground/20 h-1/2 rounded-t-sm" />
                <div className="w-full bg-muted-foreground/40 h-2/3 rounded-t-sm" />
                <div className="w-full bg-foreground h-full rounded-t-sm" />
                <div className="w-full bg-muted-foreground/60 h-4/5 rounded-t-sm" />
            </div>
        ),
    },
    {
        label: 'Entity Linking',
        value: '94.2%',
        suffix: 'ACC',
        extra: (
            <div className="mt-4 w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <div className="bg-foreground h-full w-[94%] rounded-full" />
            </div>
        ),
    },
    {
        label: 'Total Claims',
        value: '42,881',
        extra: (
            <p className="text-[10px] font-bold text-muted-foreground mt-3 flex items-center gap-1">
                <TrendingUp className="size-3" />
                +1.2k today
            </p>
        ),
    },
];

function MetricsRow() {
    return (
        <div className="grid grid-cols-3 gap-6">
            {metrics.map((m) => (
                <div
                    key={m.label}
                    className="bg-card p-4 border rounded-lg shadow-sm"
                >
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        {m.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black">{m.value}</span>
                        {m.suffix && (
                            <span className="text-[10px] font-bold text-muted-foreground">
                                {m.suffix}
                            </span>
                        )}
                    </div>
                    {m.extra}
                </div>
            ))}
        </div>
    );
}

// --- Main Page ---

export function ExtractionEnginePage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory' },
                { label: 'Extraction Engine' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 pb-32 max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Extraction Engine
                            </h1>
                            <p className="text-muted-foreground text-sm max-w-lg">
                                Continuous ingestion pipeline decomposing raw
                                technical discourse into verified atomic
                                knowledge structures.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Filter className="size-3.5" />
                                Filter Stream
                            </Button>
                            <Button size="sm" className="gap-2">
                                <Plus className="size-3.5" />
                                Manual Ingest
                            </Button>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-12 gap-6 items-start">
                        <LiveIngestionStream />

                        {/* Right Column: Workbench + Metrics */}
                        <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                            <ClaimWorkbench />
                            <MetricsRow />
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
