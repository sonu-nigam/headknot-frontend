import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
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
    RefreshCw,
    Download,
    MessageSquare,
    Code,
    BookOpen,
    AlertTriangle,
    Zap,
    GitBranch,
} from 'lucide-react';

// --- Stats ---

interface Stat {
    label: string;
    value: string;
    suffix?: string;
    change: string;
    changeColor: string;
}

const stats: Stat[] = [
    { label: 'Total Claims', value: '1,248,392', change: '+12k today', changeColor: 'text-emerald-600' },
    { label: 'Ingestion Speed', value: '4.2', suffix: 'GB/hr', change: 'Peak 6.1', changeColor: 'text-muted-foreground' },
    { label: 'Knowledge Accuracy', value: '99.4%', change: 'Stable', changeColor: 'text-emerald-600' },
    { label: 'Active Entities', value: '42,881', change: 'Verifying...', changeColor: 'text-muted-foreground' },
];

function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((s) => (
                <div key={s.label} className="bg-card p-5 rounded-lg border shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-black">
                            {s.value}
                            {s.suffix && <span className="text-sm font-medium ml-1">{s.suffix}</span>}
                        </h3>
                        <span className={`text-xs font-bold ${s.changeColor}`}>{s.change}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Ongoing Extraction ---

interface ExtractionThread {
    source: string;
    icon: React.ReactNode;
    progress: number;
    detail: string;
}

const threads: ExtractionThread[] = [
    { source: 'Slack: #engineering-core', icon: <MessageSquare className="size-4" />, progress: 64, detail: 'Extracting causality from thread ID-99' },
    { source: 'GitHub: PR #1142', icon: <Code className="size-4" />, progress: 21, detail: 'Mapping logic changes in core module' },
    { source: 'Confluence: v2.4 Spec', icon: <BookOpen className="size-4" />, progress: 92, detail: 'Finalizing structural claim nodes' },
];

function OngoingExtraction() {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em]">Ongoing Extraction</h4>
                <Badge variant="secondary" className="text-[10px]">3 Active Threads</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {threads.map((t) => (
                    <div key={t.source} className="bg-muted p-4 rounded-lg flex flex-col justify-between h-32 border hover:border-foreground/20 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="p-1.5 bg-card rounded shadow-sm border">{t.icon}</div>
                            <span className="text-[10px] font-bold text-muted-foreground">{t.progress}%</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold truncate">{t.source}</p>
                            <div className="w-full bg-muted-foreground/20 h-1 mt-2 rounded-full overflow-hidden">
                                <div className="bg-foreground h-full rounded-full" style={{ width: `${t.progress}%` }} />
                            </div>
                            <p className="text-[9px] mt-2 text-muted-foreground font-medium">{t.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Recent Claims ---

interface RecentClaim {
    title: string;
    subject: string;
    status: 'verified' | 'needs_review' | 'contradicted';
    origin: string;
    confidence: number;
}

const recentClaims: RecentClaim[] = [
    { title: 'API Endpoint v3 deprecates legacy auth headers', subject: 'Security Protocol', status: 'verified', origin: 'PR #1142', confidence: 98 },
    { title: 'Deployment window scheduled for Sunday 04:00 UTC', subject: 'Operations', status: 'needs_review', origin: '#ops-alert', confidence: 74 },
    { title: 'PostgreSQL 14.2 contains critical write-lock bug', subject: 'Infrastructure', status: 'contradicted', origin: 'Incident Report', confidence: 12 },
];

function statusBadge(status: RecentClaim['status']) {
    if (status === 'verified')
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Verified
            </span>
        );
    if (status === 'needs_review')
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">
                <span className="size-1.5 rounded-full bg-amber-500" /> Needs Review
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-foreground text-background text-[9px] font-bold">
            <span className="size-1.5 rounded-full bg-red-400" /> Contradicted
        </span>
    );
}

function RecentClaimsTable() {
    return (
        <section className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="p-5 border-b flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em]">Recent Claims Library</h4>
                <div className="flex gap-4">
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Filter by Status</button>
                    <button className="text-[10px] font-bold underline underline-offset-2">View All</button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">Claim Identity</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">Origin</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">Confidence</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentClaims.map((c) => (
                        <TableRow key={c.title} className="hover:bg-muted/50 transition-colors">
                            <TableCell>
                                <p className={`text-xs font-bold ${c.status === 'contradicted' ? 'line-through text-muted-foreground' : ''}`}>{c.title}</p>
                                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Subject: {c.subject}</p>
                            </TableCell>
                            <TableCell>{statusBadge(c.status)}</TableCell>
                            <TableCell>
                                <span className="text-[10px] text-muted-foreground font-medium">{c.origin}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 bg-muted h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${c.confidence > 50 ? 'bg-foreground' : 'bg-muted-foreground'}`} style={{ width: `${c.confidence}%` }} />
                                    </div>
                                    <span className={`text-[10px] font-bold ${c.confidence > 50 ? '' : 'text-muted-foreground'}`}>{c.confidence}%</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}

// --- Relationship Health (Dark Card) ---

function RelationshipHealth() {
    return (
        <section className="bg-zinc-900 dark:bg-zinc-950 rounded-lg p-6 text-white relative overflow-hidden">
            <GitBranch className="absolute top-6 right-6 size-24 text-white/5" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Relationship Health</h4>
            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                        <p className="text-3xl font-black">42,881</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-500">Total Nodes</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold">92%</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-500">Density Score</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-bold text-zinc-100">12 Conflicts</p>
                        <p className="text-[10px] text-zinc-400 leading-tight mt-1 font-medium">Causality chains currently in dispute across silos.</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-100">1,102 Links</p>
                        <p className="text-[10px] text-zinc-400 leading-tight mt-1 font-medium">New cross-document connections established today.</p>
                    </div>
                </div>
                <Button variant="secondary" className="w-full bg-white text-zinc-900 hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest">
                    Visualize Active Graph
                </Button>
            </div>
        </section>
    );
}

// --- Conflict Alerts ---

interface ConflictAlert {
    severity: string;
    time: string;
    title: string;
    description: string;
}

const alerts: ConflictAlert[] = [
    {
        severity: 'High Severity',
        time: '2m ago',
        title: 'Conflicting "Go-Live" Dates',
        description: 'Slack suggests Oct 12, but Confluence PRD indicates Oct 15. Causality node broken.',
    },
    {
        severity: 'Semantic Drift',
        time: '1h ago',
        title: 'Term: "Core-Engine"',
        description: 'Design system and Backend Repo are using disparate definitions for this entity.',
    },
];

function ConflictAlerts() {
    return (
        <section>
            <h4 className="text-[11px] font-black uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Conflict Alerts
            </h4>
            <div className="space-y-3">
                {alerts.map((a) => (
                    <div key={a.title} className="bg-card p-4 rounded-lg border hover:border-foreground/20 transition-colors cursor-pointer">
                        <div className="flex justify-between mb-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">{a.severity}</p>
                            <span className="text-[9px] text-muted-foreground font-bold">{a.time}</span>
                        </div>
                        <h5 className="text-xs font-bold">{a.title}</h5>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed font-medium">{a.description}</p>
                        <div className="mt-3 flex gap-2">
                            <Button size="sm" className="text-[9px] h-6 px-2">Resolve Manually</Button>
                            <Button variant="ghost" size="sm" className="text-[9px] h-6 px-2 text-muted-foreground">Ignore</Button>
                        </div>
                    </div>
                ))}
                <button className="w-full py-3 border border-dashed text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors rounded-lg">
                    View Resolution History
                </button>
            </div>
        </section>
    );
}

// --- Extraction Pulse ---

function ExtractionPulse() {
    return (
        <div className="bg-muted/50 border p-5 rounded-lg shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <Zap className="size-5 text-muted-foreground" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Extraction Pulse</h4>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                    {['A1', 'B2', 'C3'].map((label) => (
                        <div key={label} className="size-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[8px] font-bold">
                            {label}
                        </div>
                    ))}
                </div>
                <span className="text-[10px] font-bold text-emerald-600">0.04ms Latency</span>
            </div>
            <p className="text-[9px] text-muted-foreground mt-4 font-medium italic">
                The Arbiter is currently syncing cross-domain dependencies at sub-second speeds.
            </p>
        </div>
    );
}

// --- Main Page ---

export function MemoryCenterPage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory Center' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Memory Center</h2>
                            <p className="text-muted-foreground text-sm mt-1 font-medium">Orchestrating cross-domain cognitive links and claim verification.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" className="gap-2">
                                <Download className="size-3.5" />
                                Export Snapshot
                            </Button>
                            <Button size="sm" className="gap-2">
                                <RefreshCw className="size-3.5" />
                                Force Sync
                            </Button>
                        </div>
                    </div>

                    <StatsGrid />

                    {/* Core Grid */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left */}
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            <OngoingExtraction />
                            <RecentClaimsTable />
                        </div>
                        {/* Right */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            <RelationshipHealth />
                            <ConflictAlerts />
                            <ExtractionPulse />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
