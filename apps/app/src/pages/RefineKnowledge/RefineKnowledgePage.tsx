import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import {
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Rocket,
    Settings2,
    MessageSquare,
    FileText,
    LinkIcon,
    HelpCircle,
    History,
    CheckCircle,
    Globe,
    Zap,
    Brain,
} from 'lucide-react';

// --- Review Queue ---

interface QueueItem {
    id: string;
    confidence: number;
    title: string;
    source: string;
    sourceIcon: React.ReactNode;
    active?: boolean;
}

const queueItems: QueueItem[] = [
    {
        id: 'HK-9921',
        confidence: 41,
        title: '"Project Phoenix depends_on Core.API_v4"',
        source: 'Slack #engineering',
        sourceIcon: <MessageSquare className="size-3.5" />,
        active: true,
    },
    {
        id: 'HK-7714',
        confidence: 58,
        title: '"Entity: User_John contradicts Policy_v2"',
        source: 'README.md',
        sourceIcon: <FileText className="size-3.5" />,
    },
    {
        id: 'HK-3302',
        confidence: 62,
        title: '"System.Auth is_related_to OAuth.Proxy"',
        source: 'Implicit mapping',
        sourceIcon: <LinkIcon className="size-3.5" />,
    },
    {
        id: 'HK-1190',
        confidence: 21,
        title: '"Unlinked Entity: Hyperion_Instance"',
        source: 'Graph v3.1',
        sourceIcon: <HelpCircle className="size-3.5" />,
    },
];

function ReviewQueue() {
    return (
        <section className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1 mb-1">
                <h3 className="text-xs font-bold flex items-center gap-2">
                    <RefreshCw className="size-3.5 text-muted-foreground" />
                    REVIEW QUEUE
                </h3>
                <span className="text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded-sm">
                    12 URGENT
                </span>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
                {queueItems.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all relative ${
                            item.active
                                ? 'bg-card border-2 border-primary shadow-sm'
                                : 'bg-muted border hover:bg-card hover:border-border'
                        }`}
                    >
                        {item.active && (
                            <span className="absolute top-4 right-4 text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                {item.id}
                            </span>
                        )}
                        <p
                            className={`text-[10px] font-bold mb-1 uppercase tracking-tight ${
                                item.confidence < 50
                                    ? 'text-red-600'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            Confidence: {item.confidence}%
                        </p>
                        <h4
                            className={`text-sm font-semibold mb-3 leading-tight ${item.active ? 'pr-12' : ''} ${
                                item.active
                                    ? 'font-bold'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                            {item.sourceIcon}
                            <span>{item.source}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Relationship Refiner ---

function RelationshipRefiner() {
    const [strength, setStrength] = useState(70);

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/50">
                <h2 className="text-sm font-bold flex items-center gap-2">
                    <Settings2 className="size-4 text-primary" />
                    Relationship Refiner
                </h2>
                <div className="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground"
                    >
                        <History className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground"
                    >
                        <HelpCircle className="size-4" />
                    </Button>
                </div>
            </div>
            <div className="p-8">
                {/* Entity Visual */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="flex-1 p-4 bg-muted border rounded-lg flex flex-col items-center gap-2 text-center">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            Source Entity
                        </span>
                        <span className="text-sm font-bold">
                            Project Phoenix
                        </span>
                        <div className="size-8 rounded bg-foreground flex items-center justify-center">
                            <Rocket className="size-4 text-background" />
                        </div>
                    </div>

                    <div className="flex-[1.5] flex flex-col items-center gap-2">
                        <div className="w-full h-px bg-border relative">
                            <div className="absolute inset-0 bg-primary w-1/2" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border px-3 py-1.5 rounded-full shadow-sm flex items-center gap-3">
                                <ChevronLeft className="size-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                                <span className="text-[11px] font-bold">
                                    depends_on
                                </span>
                                <ChevronRight className="size-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 bg-muted border rounded-lg flex flex-col items-center gap-2 text-center">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            Target Entity
                        </span>
                        <span className="text-sm font-bold">Core.API_v4</span>
                        <div className="size-8 rounded border flex items-center justify-center">
                            <Settings2 className="size-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase block mb-3">
                            Relationship Strength
                        </Label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={strength}
                            onChange={(e) =>
                                setStrength(Number(e.target.value))
                            }
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground font-medium">
                                Heuristic
                            </span>
                            <span className="text-[10px] font-bold tracking-tight">
                                Definitive
                            </span>
                        </div>
                    </div>
                    <div>
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase block mb-3">
                            Conflict Policy
                        </Label>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 text-[11px] font-bold text-muted-foreground"
                            >
                                Permissive
                            </Button>
                            <Button className="flex-1 text-[11px] font-bold">
                                Strict Path
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t pt-6">
                    <Button className="flex-[2] gap-2">
                        <CheckCircle className="size-4" />
                        CONFIRM RELATIONSHIP
                    </Button>
                    <Button variant="outline" className="flex-1">
                        DISCARD CLAIM
                    </Button>
                </div>
            </div>
        </div>
    );
}

// --- Cognitive Stats ---

function CognitiveStats() {
    return (
        <div className="bg-zinc-950 dark:bg-zinc-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
            <Brain className="absolute top-6 right-6 size-20 text-white/5" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-bold tracking-tight">
                        Cognitive Infrastructure Stats
                    </h3>
                    <Badge
                        variant="outline"
                        className="text-[9px] border-zinc-700 text-zinc-400"
                    >
                        LIVE SYNC
                    </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase mb-2">
                            Impact Factor
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">8.4x</span>
                            <span className="text-[10px] font-bold text-blue-500">
                                REACH
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase mb-2">
                            Model Drift
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">0.02%</span>
                            <span className="text-[10px] font-bold text-green-500">
                                STABLE
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase mb-2">
                            Automation Ratio
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">94%</span>
                            <span className="text-[10px] font-bold text-zinc-400">
                                AUTO
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-zinc-800">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-zinc-400">
                            Monthly Calibration Goal
                        </span>
                        <span className="text-[10px] font-bold">
                            1,402{' '}
                            <span className="text-zinc-500">/ 2,000</span>
                        </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: '70%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Metrics ---

function MetricsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border rounded-lg flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        Graph Coverage
                    </p>
                    <p className="text-lg font-bold">82.1%</p>
                </div>
                <Globe className="size-6 text-muted-foreground/30" />
            </div>
            <div className="p-4 bg-card border rounded-lg flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        Neural Latency
                    </p>
                    <p className="text-lg font-bold">12ms</p>
                </div>
                <Zap className="size-6 text-muted-foreground/30" />
            </div>
        </div>
    );
}

// --- Main Page ---

export function RefineKnowledgePage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory' },
                { label: 'Refine Knowledge' },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                        <div className="max-w-xl">
                            <Badge className="mb-4 gap-1.5 text-[10px] uppercase tracking-wider">
                                <RefreshCw className="size-3" />
                                Feedback Loop
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight mb-3">
                                Refine Knowledge
                            </h1>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                System-wide review of low-confidence cognitive
                                connections. Corrections calibrate the neural
                                graph for infrastructure stability.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-card border px-4 py-3 rounded-lg shadow-sm min-w-[140px]">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                                    Accuracy Gain
                                </p>
                                <p className="text-xl font-bold text-primary">
                                    +12.4%
                                </p>
                            </div>
                            <div className="bg-card border px-4 py-3 rounded-lg shadow-sm min-w-[140px]">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                                    Queue Depth
                                </p>
                                <p className="text-xl font-bold">42</p>
                            </div>
                        </div>
                    </header>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <ReviewQueue />

                        {/* Right Column */}
                        <section className="lg:col-span-8 flex flex-col gap-6">
                            <RelationshipRefiner />
                            <CognitiveStats />
                            <MetricsGrid />
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
