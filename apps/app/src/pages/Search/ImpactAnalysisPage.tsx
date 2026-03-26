import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import {
    AlertCircle,
    GitBranch,
    LinkIcon,
    Link2Off,
    AlertTriangle,
    History,
    Lightbulb,
    Ticket,
    MessageSquare,
    FileText,
    Loader2,
    SearchIcon,
    ArrowRight,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';
import { ViewAlternativesButton } from '@/components/ViewAlternativesButton';

// --- Risk Score Card ---

function RiskScoreCard() {
    return (
        <div className="md:col-span-4 bg-card p-6 rounded-xl shadow-sm border flex flex-col justify-between">
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Impact Risk Score
                </p>
                <h3 className="text-5xl font-extrabold text-destructive">
                    8.4
                    <span className="text-xl text-muted-foreground font-medium">
                        /10
                    </span>
                </h3>
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between items-end">
                    <span className="text-sm font-medium">
                        System Stability
                    </span>
                    <span className="text-xs text-destructive font-bold">
                        -62%
                    </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-destructive rounded-full"
                        style={{ width: '84%' }}
                    />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    High probability of cascading failures in 14 downstream
                    microservices due to tight coupling of V1 endpoints.
                </p>
            </div>
        </div>
    );
}

// --- Affected Entities Stats ---

interface StatItem {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const statItems: StatItem[] = [
    {
        icon: <GitBranch className="size-5 text-primary mb-2" />,
        value: '142',
        label: 'Affected Nodes',
    },
    {
        icon: <Link2Off className="size-5 text-destructive mb-2" />,
        value: '38',
        label: 'Broken Links',
    },
    {
        icon: <AlertTriangle className="size-5 text-muted-foreground mb-2" />,
        value: '12',
        label: 'Logic Conflicts',
    },
    {
        icon: <History className="size-5 text-muted-foreground mb-2" />,
        value: '4.2y',
        label: 'Legacy Debt',
    },
];

function AffectedEntities() {
    return (
        <div className="md:col-span-8 bg-muted p-6 rounded-xl border grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((stat) => (
                <div key={stat.label} className="p-4 bg-card rounded-lg">
                    {stat.icon}
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                        {stat.label}
                    </p>
                </div>
            ))}
            {/* Recommendation */}
            <div className="col-span-full mt-2 p-4 bg-zinc-900 dark:bg-zinc-950 rounded-lg flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded">
                    <Lightbulb className="size-4 text-white" />
                </div>
                <div>
                    <p className="text-xs text-zinc-400 font-semibold">
                        Arbiter Recommendation
                    </p>
                    <p className="text-sm text-white/90">
                        Implement a &lsquo;Shadow Proxy&rsquo; layer for V1
                        requests to intercept and redirect to V2-compatible
                        schemas before full sunset.
                    </p>
                </div>
            </div>
        </div>
    );
}

// --- Causality Map ---

interface TreeNode {
    label: string;
    title: string;
    type: 'entry' | 'service' | 'failure' | 'evidence';
    detail?: string;
}

const treeNodesTier1: TreeNode[] = [
    { label: 'AUTH SERVICE', title: 'Legacy Token Handler', type: 'service' },
    { label: 'DATA ENGINE', title: 'Claim Retrieval Hub', type: 'service' },
    { label: 'SCHEMA GEN', title: 'V1 Map Validator', type: 'service' },
];

const failureNodes: { label: string; title: string; detail: string }[] = [
    {
        label: 'BROKEN LINK',
        title: 'Mobile App v4.2.0',
        detail: '"Auth payload structure missing"',
    },
    {
        label: 'CONTRADICTION',
        title: 'B2B Integration Layer',
        detail: '"Endpoint 404 vs Required SLA"',
    },
];

const evidenceNodes: { source: string; label: string; detail: string }[] = [
    {
        source: 'Jira INF-1022',
        label: 'JIRA',
        detail: 'Reports v4.2 crashes on staging cluster.',
    },
    {
        source: 'Slack #api-ops',
        label: 'SLACK',
        detail: 'Ops team flagged SLA risks on 08/14.',
    },
];

function CausalityMap() {
    return (
        <div className="md:col-span-12 bg-muted rounded-xl overflow-hidden relative border min-h-[420px]">
            <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest">
                        Causality Mapping
                    </h4>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="size-2 rounded-full bg-foreground" />{' '}
                            Core
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="size-2 rounded-full bg-destructive" />{' '}
                            Failure Point
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="size-2 rounded-full border border-dashed border-muted-foreground" />{' '}
                            Evidence
                        </span>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-4 gap-6 items-start py-4">
                    {/* Entry Point */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                            Entry Point
                        </p>
                        <div className="p-4 bg-card rounded-lg shadow-sm border-l-4 border-l-foreground">
                            <p className="text-[10px] font-bold text-muted-foreground">
                                ENTRY POINT
                            </p>
                            <p className="text-sm font-bold">API Gateway V1</p>
                        </div>
                    </div>

                    {/* Tier 1 Services */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                            Dependencies
                        </p>
                        {treeNodesTier1.map((node) => (
                            <div
                                key={node.title}
                                className="p-3 bg-card rounded-lg shadow-sm border"
                            >
                                <p className="text-[10px] font-bold text-muted-foreground">
                                    {node.label}
                                </p>
                                <p className="text-xs">{node.title}</p>
                            </div>
                        ))}
                    </div>

                    {/* Failure Points */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-destructive uppercase mb-2">
                            Failure Points
                        </p>
                        {failureNodes.map((node) => (
                            <div
                                key={node.title}
                                className="p-3 bg-destructive/5 rounded-lg border-2 border-destructive"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="size-3 text-destructive" />
                                    <p className="text-[10px] font-bold text-destructive">
                                        {node.label}
                                    </p>
                                </div>
                                <p className="text-xs font-bold">
                                    {node.title}
                                </p>
                                <p className="text-[10px] text-muted-foreground italic mt-1">
                                    {node.detail}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Evidence Nodes */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                            Evidence
                        </p>
                        {evidenceNodes.map((node) => (
                            <div
                                key={node.source}
                                className="p-2 bg-card/80 border border-dashed rounded-lg"
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    {node.label === 'JIRA' ? (
                                        <Ticket className="size-3 text-primary" />
                                    ) : (
                                        <MessageSquare className="size-3 text-primary" />
                                    )}
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase">
                                        {node.source}
                                    </p>
                                </div>
                                <p className="text-[10px] leading-tight">
                                    {node.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Impact Evidence Panel ---

interface EvidenceItem {
    badge: string;
    badgeColor: string;
    date: string;
    title: string;
    description: string;
    dimmed?: boolean;
}

const impactEvidence: EvidenceItem[] = [
    {
        badge: 'JIRA',
        badgeColor: 'text-primary bg-primary/10',
        date: '2 days ago',
        title: 'INF-1022: Regression in V1 Auth',
        description:
            '"Auth payload structure mismatch in mobile app v4.2.0. Predicted breakage if V1 sunset proceeds."',
    },
    {
        badge: 'SLACK',
        badgeColor: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-950',
        date: 'Today, 10:42 AM',
        title: '#platform-architecture',
        description:
            '@dev_lead: "B2B integration layer doesn\'t have a fallback for 404s on the legacy endpoint."',
    },
    {
        badge: 'DOCS',
        badgeColor: 'text-muted-foreground bg-muted',
        date: 'May 2024',
        title: 'SLA_Platinum_Accounts.pdf',
        description:
            'Explicit guarantee of V1 support through Q1 2025.',
        dimmed: true,
    },
];

function ImpactEvidencePanel() {
    return (
        <div className="lg:col-span-1 bg-muted rounded-xl p-5 border">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold uppercase tracking-widest">
                    Impact Evidence
                </h4>
                <History className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
                {impactEvidence.map((item) => (
                    <div
                        key={item.title}
                        className={`p-3 bg-card rounded-lg border ${item.dimmed ? 'opacity-70' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}
                            >
                                {item.badge}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                {item.date}
                            </span>
                        </div>
                        <p className="text-xs font-semibold mb-1">
                            {item.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Contradictions ---

interface Contradiction {
    tag: string;
    title: string;
    claim: string;
    contradiction: string;
    impactedOrg: string;
}

const contradictions: Contradiction[] = [
    {
        tag: 'LOGIC ERROR',
        title: 'Deprecation vs. Enterprise SLA',
        claim: '"We can sunset V1 in Q3 2024 to reduce costs."',
        contradiction:
            'Service Level Agreement #4412 guarantees support for Legacy Endpoints until Q1 2025 for all Platinum-tier accounts.',
        impactedOrg: 'Customer Success',
    },
    {
        tag: 'DEPENDENCY GAP',
        title: 'Data Sovereignty Conflict',
        claim: '"Direct migration to V2 is possible for all regions."',
        contradiction:
            'The German data-center cluster lacks the necessary V2-encryption hardware modules, causing localized service outages if V1 is disabled.',
        impactedOrg: 'Infrastructure (EMEA)',
    },
];

function ContradictionsPanel() {
    return (
        <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest px-1">
                Structural Contradictions Identified
            </h4>
            {contradictions.map((item) => (
                <div
                    key={item.title}
                    className="bg-card p-5 rounded-xl border-l-4 border-l-destructive flex items-start gap-6 shadow-sm"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge
                                variant="secondary"
                                className="text-[10px]"
                            >
                                {item.tag}
                            </Badge>
                            <h5 className="text-sm font-bold">{item.title}</h5>
                        </div>
                        <p className="text-sm leading-relaxed">
                            <span className="font-bold">Claim:</span>{' '}
                            {item.claim}
                            <br />
                            <span className="font-bold text-destructive">
                                Contradiction:
                            </span>{' '}
                            {item.contradiction}
                        </p>
                    </div>
                    <div className="hidden md:block w-px h-16 bg-border" />
                    <div className="hidden md:block w-48">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                            Impacted Org
                        </p>
                        <p className="text-xs font-medium">
                            {item.impactedOrg}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Main Page ---

export function ImpactAnalysisPage() {
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
                { label: 'Impact Analysis' },
            ]}
        >
            <div className="flex-1 overflow-y-auto relative">
                <div className="p-8 pb-32 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge
                                    variant="destructive"
                                    className="text-[10px] uppercase tracking-wider"
                                >
                                    Critical Impact
                                </Badge>
                                <span className="text-muted-foreground text-sm font-medium">
                                    Simulation ID: #INF-882-V1
                                </span>
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                V1 API Deprecation Analysis
                            </h2>
                            {answer?.text ? (
                                <p className="text-muted-foreground max-w-2xl mt-2 leading-relaxed">
                                    {answer.text}
                                </p>
                            ) : (
                                <p className="text-muted-foreground max-w-2xl mt-2 leading-relaxed">
                                    System-wide causality mapping of structural
                                    dependencies, identifying broken logical links
                                    and conflicting service claims.
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary">Export Report</Button>
                            <Button>Run Mitigation</Button>
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <RiskScoreCard />
                        <AffectedEntities />
                        <CausalityMap />

                        {/* Bottom: Evidence + Contradictions */}
                        <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <ImpactEvidencePanel />
                            <ContradictionsPanel />
                        </div>
                    </div>

                    <ViewAlternativesButton />
                </div>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
