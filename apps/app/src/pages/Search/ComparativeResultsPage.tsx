import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import {
    ShieldCheck,
    GitBranch,
    MessageSquare,
    GitCommit,
    FileText,
    FlaskConical,
    ThumbsUp,
    Zap,
    AlertTriangle,
    Link,
    Terminal,
    Database,
    Loader2,
    SearchIcon,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

// --- Synthesis Recommendation ---

function SynthesisRecommendation() {
    return (
        <section className="bg-gradient-to-br from-foreground/5 to-muted p-px rounded-xl shadow-lg">
            <div className="bg-card rounded-[calc(0.75rem-1px)] p-6 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge className="text-[10px] tracking-wider uppercase">
                            Synthesis Recommendation
                        </Badge>
                        <span className="text-xs text-muted-foreground italic">
                            Confidence Score: 94%
                        </span>
                    </div>
                    <h3 className="text-xl font-bold">
                        PostgreSQL (Relational Strategy)
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Given your requirement for{' '}
                        <span className="font-bold text-foreground">
                            Atomic transactions
                        </span>{' '}
                        and{' '}
                        <span className="font-bold text-foreground">
                            Multi-node graph traversal
                        </span>
                        , PostgreSQL is the superior choice. Its mature JSONB
                        support offers the flexibility of NoSQL while
                        maintaining strict ACID compliance necessary for causal
                        infrastructure mapping.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="secondary"
                            className="text-[10px] gap-1"
                        >
                            <ShieldCheck className="size-3" /> Data Integrity
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="text-[10px] gap-1"
                        >
                            <GitBranch className="size-3" /> Graph Capability
                        </Badge>
                    </div>
                </div>
                <div className="w-full md:w-64 aspect-video rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Database className="size-16 text-primary/30" />
                </div>
            </div>
        </section>
    );
}

// --- Trade-off Matrix ---

interface MatrixRow {
    attribute: string;
    linkCount: number;
    mongoLabel: string;
    mongoDesc: string;
    pgLabel: string;
    pgDesc: string;
}

const matrixRows: MatrixRow[] = [
    {
        attribute: 'Schema Flexibility',
        linkCount: 12,
        mongoLabel: 'Dynamic',
        mongoDesc:
            'Schemaless; ideal for rapid prototyping and polymorphic data.',
        pgLabel: 'Hybrid',
        pgDesc: 'Strict relational schema with powerful JSONB document support.',
    },
    {
        attribute: 'Query Complexity',
        linkCount: 8,
        mongoLabel: 'MQL',
        mongoDesc:
            'Optimized for single-collection retrieval; joins are complex.',
        pgLabel: 'SQL / CTE',
        pgDesc: 'Highly sophisticated; excels at deep relational & graph queries.',
    },
    {
        attribute: 'Scalability Model',
        linkCount: 15,
        mongoLabel: 'Horizontal',
        mongoDesc:
            'Native sharding makes it easier to scale out across nodes.',
        pgLabel: 'Vertical+',
        pgDesc: 'Primary focus on vertical growth; sharding requires Citus.',
    },
    {
        attribute: 'Consistency',
        linkCount: 6,
        mongoLabel: 'Eventual',
        mongoDesc:
            'Configurable, but defaults favor availability over consistency.',
        pgLabel: 'Immediate',
        pgDesc: 'ACID compliant by design; guarantees causal consistency.',
    },
];

function TradeoffMatrix() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Trade-off Matrix
                </h4>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] rounded-full h-7"
                    >
                        Collapse All
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="text-[10px] rounded-full h-7"
                    >
                        Export PDF
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Attribute Column */}
                <div className="p-4 bg-muted rounded-lg space-y-4">
                    <div className="h-12 flex items-center font-bold text-xs uppercase opacity-40">
                        Attribute
                    </div>
                    {matrixRows.map((row) => (
                        <div
                            key={row.attribute}
                            className="h-20 flex items-center border-t text-sm font-semibold justify-between"
                        >
                            <span>{row.attribute}</span>
                            <button className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted-foreground/10 text-[10px] text-primary hover:bg-primary/10 transition-colors">
                                <Link className="size-2.5" />
                                {row.linkCount}
                            </button>
                        </div>
                    ))}
                </div>

                {/* MongoDB Column */}
                <div className="p-4 bg-card rounded-lg shadow-sm space-y-4 ring-1 ring-border">
                    <div className="h-12 flex items-center gap-3">
                        <div className="size-8 rounded bg-muted flex items-center justify-center">
                            <Terminal className="size-4 text-muted-foreground" />
                        </div>
                        <span className="font-bold">MongoDB</span>
                    </div>
                    {matrixRows.map((row) => (
                        <div
                            key={row.attribute}
                            className="h-20 flex flex-col justify-center border-t gap-1"
                        >
                            <div
                                className={`text-[10px] uppercase font-bold ${row.attribute === 'Schema Flexibility' ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                {row.mongoLabel}
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">
                                {row.mongoDesc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* PostgreSQL Column (Winner) */}
                <div className="p-4 bg-card rounded-lg shadow-sm space-y-4 ring-2 ring-primary/20">
                    <div className="h-12 flex items-center gap-3">
                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
                            <Database className="size-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">PostgreSQL</span>
                            <Badge className="text-[8px] w-fit h-4">
                                WINNER
                            </Badge>
                        </div>
                    </div>
                    {matrixRows.map((row) => (
                        <div
                            key={row.attribute}
                            className="h-20 flex flex-col justify-center border-t gap-1"
                        >
                            <div
                                className={`text-[10px] uppercase font-bold ${row.attribute === 'Schema Flexibility' ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                {row.pgLabel}
                            </div>
                            <p className="text-xs text-muted-foreground leading-tight">
                                {row.pgDesc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Evidence Matrix ---

interface EvidenceCategory {
    icon: React.ReactNode;
    label: string;
    items: { title: string; meta: string }[];
}

const evidenceCategories: EvidenceCategory[] = [
    {
        icon: <MessageSquare className="size-3.5 text-primary" />,
        label: 'Chat Threads',
        items: [
            {
                title: '"Why we moved to JSONB..."',
                meta: 'Architecture Stream • Oct 12',
            },
            {
                title: '"Postgres scaling bottlenecks"',
                meta: 'SRE Channel • Oct 09',
            },
        ],
    },
    {
        icon: <GitCommit className="size-3.5 text-primary" />,
        label: 'PRs & Commits',
        items: [
            {
                title: 'PR #842: Schema Migration',
                meta: 'infra-core • Merged 2d ago',
            },
            {
                title: 'feat: add jsonb indexing',
                meta: 'data-layer • Committed 5d ago',
            },
        ],
    },
    {
        icon: <FileText className="size-3.5 text-primary" />,
        label: 'Documentation',
        items: [
            {
                title: 'Scalability Roadmap 2024',
                meta: 'Internal Wiki • v2.1',
            },
            {
                title: 'Relational Policy v4',
                meta: 'Governance • Signed',
            },
        ],
    },
    {
        icon: <FlaskConical className="size-3.5 text-primary" />,
        label: 'External Labs',
        items: [
            {
                title: 'Benchmarking JIT SQL',
                meta: 'ACM Digital Library • 2023',
            },
            {
                title: 'Vector Search Perf',
                meta: 'arXiv • Published Oct',
            },
        ],
    },
];

function EvidenceMatrix() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Evidence Matrix
                </h4>
                <span className="text-[10px] text-muted-foreground">
                    Sources from active workspace streams
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {evidenceCategories.map((cat) => (
                    <div
                        key={cat.label}
                        className="bg-muted p-4 rounded-xl space-y-3"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {cat.icon}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {cat.label}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {cat.items.map((item) => (
                                <div
                                    key={item.title}
                                    className="group cursor-pointer"
                                >
                                    <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">
                                        {item.title}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {item.meta}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Pros & Cons ---

function ProsAndCons() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Functional Pros
                </h4>
                <div className="space-y-3">
                    <div className="p-4 bg-card rounded-lg border-l-4 border-l-emerald-500 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-emerald-600">
                                PostgreSQL Advantage
                            </span>
                            <ThumbsUp className="size-4 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium">
                            Native Graph Capabilities
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            Recursive CTEs allow for deep hierarchy traversals
                            without specialized DBs.
                        </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border-l-4 border-l-blue-500 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-600">
                                MongoDB Advantage
                            </span>
                            <Zap className="size-4 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium">Deployment Speed</p>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            Skip migrations during MVP phase; iterate on
                            &ldquo;Claim&rdquo; structures in real-time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Cons */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Critical Vulnerabilities
                </h4>
                <div className="bg-muted rounded-xl p-6 relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="flex gap-4">
                            <div className="size-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="size-3.5 text-destructive" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-destructive">
                                    Data Fragmentation (MongoDB)
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Without schema enforcement, cognitive claims
                                    can become inconsistent across different
                                    logic nodes over time.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="size-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                                <AlertTriangle className="size-3.5 text-destructive" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-destructive">
                                    Connection Overhead (PostgreSQL)
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Requires sophisticated connection pooling
                                    (like PgBouncer) for serverless or highly
                                    concurrent cognitive workloads.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export function ComparativeResultsPage() {
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

    const results = searchResults?.items ?? [];

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Comparative Results' },
            ]}
        >
            <div className="flex-1 overflow-y-auto relative">
                <div className="p-6 md:p-8 pb-32 max-w-7xl w-full mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                            <span>Analysis</span>
                            <span className="text-[10px]">&rsaquo;</span>
                            <span>Comparative Matrix</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Comparative Results: MongoDB vs PostgreSQL
                        </h2>
                        <p className="text-muted-foreground max-w-2xl leading-relaxed">
                            Systematic evaluation of document-oriented
                            flexibility against relational integrity for
                            high-scale cognitive data processing.
                        </p>
                    </div>

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
                                No comparative data found for &ldquo;{query}
                                &rdquo;
                            </p>
                            <p className="text-xs mt-1">
                                Try a different comparison query.
                            </p>
                        </div>
                    )}

                    {/* Synthesis Recommendation */}
                    <SynthesisRecommendation />

                    {/* Trade-off Matrix */}
                    <TradeoffMatrix />

                    {/* Evidence Matrix */}
                    <EvidenceMatrix />

                    {/* Pros & Cons */}
                    <ProsAndCons />

                    {/* Footer */}
                    <footer className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            Last updated: Oct 24, 2023 • Analysis by Headknot
                            Engine v4.2
                        </p>
                        <div className="flex gap-3">
                            <Button variant="secondary">
                                View Detailed Logs
                            </Button>
                            <Button>Configure Deployment</Button>
                        </div>
                    </footer>
                </div>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
