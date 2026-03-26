import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import {
    AlertCircle,
    CheckCircle,
    ClipboardList,
    ShieldAlert,
    ArrowRight,
    LinkIcon,
    Loader2,
    SearchIcon,
    GitBranch,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';
import { ViewAlternativesButton } from '@/components/ViewAlternativesButton';

// --- Reasoning Path (3-step causal chain) ---

interface ReasoningStep {
    stepLabel: string;
    stepNumber: string;
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    highlighted?: boolean;
}

const reasoningSteps: ReasoningStep[] = [
    {
        stepLabel: 'Stimulus',
        stepNumber: '01',
        icon: <ClipboardList className="size-5 text-primary" />,
        iconBg: 'bg-card',
        title: 'Requirement change',
        description:
            'Stakeholders requested real-time global session revocation (< 200ms) for high-risk accounts.',
    },
    {
        stepLabel: 'Obstacle',
        stepNumber: '02',
        icon: <ShieldAlert className="size-5 text-destructive" />,
        iconBg: 'bg-card',
        title: 'Security conflict',
        description:
            'Existing PostgreSQL encryption at rest introduced a 450ms latency overhead per row-level decryption.',
    },
    {
        stepLabel: 'Resolution',
        stepNumber: '03',
        icon: <CheckCircle className="size-5 text-primary" />,
        iconBg: 'bg-primary/10',
        title: 'Migration to Redis',
        description:
            'Implemented Redis as an in-memory session store with transient TTL, bypassing SQL overhead.',
        highlighted: true,
    },
];

function ReasoningPath() {
    return (
        <section className="max-w-5xl mx-auto mb-12">
            <div className="bg-muted rounded-xl p-8 relative overflow-hidden">
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {reasoningSteps.map((step, i) => (
                        <div key={step.stepNumber} className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`size-10 rounded ${step.iconBg} flex items-center justify-center shadow-sm`}
                                >
                                    {step.icon}
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                    Step {step.stepNumber}: {step.stepLabel}
                                </span>
                            </div>
                            <div
                                className={`p-5 rounded-lg shadow-sm border ${
                                    step.highlighted
                                        ? 'bg-primary/10 border-primary/20'
                                        : 'bg-card'
                                }`}
                            >
                                <h3 className="text-sm font-bold mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                            {/* Connector arrow */}
                            {i < reasoningSteps.length - 1 && (
                                <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2">
                                    <ArrowRight className="size-4 text-border" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Timeline of Claims ---

interface Claim {
    date: string;
    source: string;
    badge: string;
    badgeVariant: 'default' | 'secondary' | 'destructive';
    quote: string;
    tags: string[];
    dotColor: string;
}

const claims: Claim[] = [
    {
        date: 'Mar 12, 14:02',
        source: 'ARCHITECTURE LOG',
        badge: 'VERIFIED',
        badgeVariant: 'default',
        quote: '"Current SQL throughput is hitting bottleneck during peak session validation windows."',
        tags: ['Node: Latency', 'Ref: #SQL-902'],
        dotColor: 'border-foreground',
    },
    {
        date: 'Mar 14, 09:45',
        source: 'SECURITY REVIEW',
        badge: 'CRITICAL',
        badgeVariant: 'destructive',
        quote: '"Encryption-at-rest requirements are non-negotiable for SQL persistence layers."',
        tags: ['Node: Compliance'],
        dotColor: 'border-destructive/50',
    },
    {
        date: 'Mar 15, 11:00',
        source: 'FINAL DECISION',
        badge: 'IMPLEMENTED',
        badgeVariant: 'secondary',
        quote: '"Authorize migration of session-data to ephemeral Redis clusters to maintain sub-100ms P99."',
        tags: ['Node: Performance', 'Node: Redis'],
        dotColor: 'border-muted-foreground',
    },
];

function TimelineOfClaims() {
    return (
        <div className="col-span-12 lg:col-span-8 bg-muted rounded-xl p-6">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-tight">
                    Timeline of Claims
                </h3>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                        SORT: CAUSAL
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                        VIEW: RAW
                    </Badge>
                </div>
            </div>
            <div className="space-y-6 relative ml-4 border-l-2 border-border pl-8">
                {claims.map((claim) => (
                    <div key={claim.date} className="relative">
                        <div
                            className={`absolute -left-[41px] top-1 size-4 rounded-full bg-card border-4 ${claim.dotColor} shadow-sm`}
                        />
                        <div className="bg-card p-5 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                                    {claim.date} — {claim.source}
                                </span>
                                <Badge
                                    variant={claim.badgeVariant}
                                    className="text-[9px]"
                                >
                                    {claim.badge}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium mb-3 leading-tight">
                                {claim.quote}
                            </p>
                            <div className="flex gap-2">
                                {claim.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-[10px]"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Relational Cluster Visual ---

function RelationalCluster() {
    return (
        <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Relational Cluster
            </h4>
            <div className="h-48 relative bg-muted rounded-lg flex items-center justify-center">
                <div className="absolute size-24 border border-border rounded-full animate-pulse opacity-50" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="size-10 bg-foreground rounded-full flex items-center justify-center text-background text-xs font-bold mb-2">
                        SQL
                    </div>
                    <div className="flex gap-8 mt-2">
                        <div className="size-8 bg-muted rounded-full flex items-center justify-center text-[8px] font-bold border">
                            Latency
                        </div>
                        <div className="size-8 bg-muted rounded-full flex items-center justify-center text-[8px] font-bold border">
                            Auth
                        </div>
                    </div>
                    <div className="size-12 bg-card border-2 border-foreground rounded-full flex items-center justify-center text-[10px] font-bold mt-4 shadow-lg">
                        Redis
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 leading-normal italic text-center">
                Interactive Graph view available in &ldquo;Graph&rdquo; tab
            </p>
        </div>
    );
}

// --- Evidence Metric ---

interface Metric {
    label: string;
    value: string;
    percent: number;
}

const metrics: Metric[] = [
    { label: 'P99 LATENCY (POST-MIGRATION)', value: '84ms', percent: 84 },
    {
        label: 'SYSTEM COMPLEXITY INCREASE',
        value: 'Low (+12%)',
        percent: 12,
    },
];

function EvidenceMetric() {
    return (
        <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-5 text-white">
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">
                Evidence Metric
            </h4>
            <div className="space-y-4">
                {metrics.map((m) => (
                    <div key={m.label}>
                        <div className="flex justify-between text-[10px] mb-1 font-medium">
                            <span>{m.label}</span>
                            <span className="text-white">{m.value}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full"
                                style={{ width: `${m.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Button
                variant="outline"
                className="w-full mt-6 text-[10px] font-bold tracking-widest uppercase border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
                View Raw Benchmarks
            </Button>
        </div>
    );
}

// --- Sources ---

function SourcesPanel() {
    const sources = [
        'Confluence: RFC-2024-Auth',
        'GitHub: PR #8829 (Migration)',
    ];
    return (
        <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                Sources
            </h4>
            <ul className="text-xs space-y-2 text-muted-foreground">
                {sources.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                        <LinkIcon className="size-3.5" />
                        <span className="underline decoration-border">
                            {s}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// --- Main Page ---

export function ReasoningResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: searchResults, isLoading } = useQuery({
        ...searchQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            query,
            limit: 10,
        }),
        enabled: !!query && !!selectedWorkspaceId,
    });

    const answer = searchResults?.answer;

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Reasoning Results' },
            ]}
        >
            <div className="flex-1 overflow-y-auto relative">
                <div className="pt-8 pb-32 px-8">
                    {/* Header */}
                    <section className="max-w-5xl mx-auto mb-10">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <GitBranch className="size-4" />
                            <span className="text-xs font-medium tracking-widest uppercase">
                                Causal Inquiry Result
                            </span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                            Auth Service: Redis Migration Logic
                        </h2>
                        {answer?.text ? (
                            <p className="text-muted-foreground max-w-2xl leading-relaxed">
                                {answer.text}
                            </p>
                        ) : (
                            <p className="text-muted-foreground max-w-2xl leading-relaxed">
                                The migration was triggered by a requirement shift
                                in session persistence, creating a conflict with
                                legacy database encryption layers.
                            </p>
                        )}
                    </section>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Reasoning Path */}
                    <ReasoningPath />

                    {/* Bento Grid */}
                    <div className="max-w-5xl mx-auto grid grid-cols-12 gap-6">
                        <TimelineOfClaims />

                        {/* Right Sidebar */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">
                            <RelationalCluster />
                            <EvidenceMetric />
                            <SourcesPanel />
                        </div>
                    </div>

                    <ViewAlternativesButton />
                </div>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
