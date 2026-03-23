import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Switch } from '@workspace/ui/components/switch';
import { Label } from '@workspace/ui/components/label';
import { Input } from '@workspace/ui/components/input';
import {
    Cpu,
    CloudCog,
    Database,
    Globe,
    LinkIcon,
    Link2Off,
    Settings,
    Copy,
    ExternalLink,
    History,
    RefreshCw,
    Plus,
} from 'lucide-react';

// --- Memory Controls ---

function MemoryControls() {
    const [reasoningMode, setReasoningMode] = useState(true);
    const [activeIndexing, setActiveIndexing] = useState(false);
    const [indexFrequency, setIndexFrequency] = useState(600);

    return (
        <Card>
            <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Cpu className="size-5 text-primary" />
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">
                            Memory Controls
                        </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                        94.2% Synaptic Integrity
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-bold">
                            Enhanced Reasoning Mode
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Prioritize causality chains over semantic retrieval.
                            Increases latency by 12ms.
                        </p>
                    </div>
                    <Switch
                        checked={reasoningMode}
                        onCheckedChange={setReasoningMode}
                    />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-bold">
                            Active Indexing
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Real-time ingestion of stream data sources.
                        </p>
                    </div>
                    <Switch
                        checked={activeIndexing}
                        onCheckedChange={setActiveIndexing}
                    />
                </div>
                <div className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-4">
                        <Label className="text-xs font-bold uppercase tracking-tight">
                            Index Frequency
                        </Label>
                        <span className="text-xs font-mono font-bold text-primary">
                            {indexFrequency}ms
                        </span>
                    </div>
                    <input
                        type="range"
                        min={50}
                        max={5000}
                        value={indexFrequency}
                        onChange={(e) =>
                            setIndexFrequency(Number(e.target.value))
                        }
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground">
                            Real-time (50ms)
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            Batch (5000ms)
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Active Sources ---

interface Source {
    name: string;
    description: string;
    icon: React.ReactNode;
    status: 'connected' | 'streaming' | 'disconnected';
}

const sources: Source[] = [
    {
        name: 'Primary Vector Store',
        description: 'PostgreSQL Cluster / Pinecone',
        icon: <Database className="size-4 text-muted-foreground" />,
        status: 'connected',
    },
    {
        name: 'Live Web Stream',
        description: 'RSS / Firehose Proxy',
        icon: <Globe className="size-4 text-muted-foreground" />,
        status: 'streaming',
    },
    {
        name: 'Legacy File System',
        description: 'local_archive_z_2023',
        icon: <Link2Off className="size-4 text-muted-foreground" />,
        status: 'disconnected',
    },
];

function statusColor(status: Source['status']) {
    if (status === 'disconnected') return 'border-l-destructive';
    return 'border-l-emerald-500';
}

function statusBadge(status: Source['status']) {
    if (status === 'disconnected')
        return (
            <span className="text-[10px] font-mono font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                DISCONNECTED
            </span>
        );
    if (status === 'streaming')
        return (
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                STREAMING
            </span>
        );
    return (
        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            CONNECTED
        </span>
    );
}

function ActiveSources() {
    return (
        <Card>
            <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CloudCog className="size-5 text-primary" />
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">
                            Active Sources
                        </CardTitle>
                    </div>
                    <Button variant="link" className="text-[10px] font-bold h-auto p-0">
                        <Plus className="size-3" />
                        ADD SOURCE
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {sources.map((source) => (
                    <div
                        key={source.name}
                        className={`flex items-center justify-between p-3 bg-background border-l-4 ${statusColor(source.status)} rounded-r-lg group hover:translate-x-1 transition-all`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded bg-muted flex items-center justify-center">
                                {source.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold">
                                    {source.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {source.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {statusBadge(source.status)}
                            <Settings className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// --- Public API Cluster ---

function ApiCluster() {
    return (
        <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-6 shadow-xl relative overflow-hidden text-white">
            <LinkIcon className="absolute top-6 right-6 size-20 text-white/5" />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <LinkIcon className="size-5 text-white/70" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">
                        Public API Cluster
                    </h3>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Access the headknot cognitive infrastructure
                    programmatically. Use Bearer tokens for authenticated REST
                    requests.
                </p>
                <div className="space-y-4">
                    <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xs font-bold uppercase tracking-tight">
                                Active Bearer Token
                            </h4>
                            <span className="text-[10px] text-zinc-500">
                                Expires in 12 days
                            </span>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-950 px-3 py-2 rounded font-mono text-[10px] text-zinc-300 mb-3 border border-zinc-800">
                            <span>hk_live_8293...f02k</span>
                            <button className="hover:text-white transition-colors">
                                <Copy className="size-3.5" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] font-bold py-1.5 rounded transition-colors uppercase">
                                Regenerate
                            </button>
                            <button className="flex-1 bg-red-950/40 hover:bg-red-950/60 text-red-400 text-[10px] font-bold py-1.5 rounded transition-colors uppercase border border-red-900">
                                Revoke
                            </button>
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase">
                                Usage Statistics
                            </h4>
                            <span className="text-[10px] text-zinc-500">
                                Last 24h
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-500 uppercase tracking-tight">
                                    Request Volume
                                </span>
                                <span className="text-zinc-300">12,402</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[65%]" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] pt-1">
                                <span className="text-zinc-500 uppercase tracking-tight">
                                    Error Rate
                                </span>
                                <span className="text-zinc-300">0.02%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <a
                        href="#"
                        className="text-[10px] font-bold text-zinc-500 hover:text-zinc-200 flex items-center gap-1 uppercase"
                    >
                        Developer Documentation
                        <ExternalLink className="size-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}

// --- Settings Architecture ---

function SettingsArchitecture() {
    return (
        <Card>
            <CardHeader className="pb-0">
                <div className="flex items-center gap-3">
                    <Settings className="size-5 text-primary" />
                    <CardTitle className="text-sm font-bold uppercase tracking-widest">
                        Settings Architecture
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                        API Versioning
                    </Label>
                    <select className="w-full bg-muted border-none rounded-lg text-xs font-bold py-2 px-3 focus:ring-1 focus:ring-ring">
                        <option>v1.2.0 (Stable)</option>
                        <option>v1.1.4 (Legacy)</option>
                        <option>v2.0.0-beta (Internal)</option>
                    </select>
                </div>
                <div>
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                        CORS Origin
                    </Label>
                    <Input
                        className="font-mono text-xs"
                        defaultValue="https://*.headknot.ai"
                    />
                </div>
                <div className="pt-4 flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        Global Endpoint Status: Operational
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Stats Footer ---

interface Stat {
    label: string;
    value: string;
    suffix?: string;
    change?: string;
}

const stats: Stat[] = [
    { label: 'Nodes Processed', value: '4.2M', change: '+12%' },
    { label: 'Avg Inference', value: '18ms', change: '-4ms' },
    { label: 'Index Health', value: '99.8', suffix: '%' },
    { label: 'Token Burn', value: '1.2k', suffix: '/day' },
];

function StatsFooter() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-muted p-4 rounded-lg flex flex-col justify-between h-24 border hover:bg-muted/80 transition-colors"
                >
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {stat.label}
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tighter">
                            {stat.value}
                        </span>
                        {stat.change && (
                            <span className="text-[10px] font-bold text-emerald-600">
                                {stat.change}
                            </span>
                        )}
                        {stat.suffix && (
                            <span className="text-[10px] font-bold text-muted-foreground">
                                {stat.suffix}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Main Page ---

export function ControlPanelPage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Control Panel' },
            ]}
        >
            <div className="p-8 flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
                                Central Dashboard
                            </p>
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                Cognitive Logic & Authority
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" className="gap-2">
                                <History className="size-4" />
                                Audit Log
                            </Button>
                            <Button className="gap-2">
                                <RefreshCw className="size-4" />
                                Deploy Config
                            </Button>
                        </div>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="col-span-12 lg:col-span-7 space-y-6">
                            <MemoryControls />
                            <ActiveSources />
                        </div>

                        {/* Right Column */}
                        <div className="col-span-12 lg:col-span-5 space-y-6">
                            <ApiCluster />
                            <SettingsArchitecture />
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-8">
                        <StatsFooter />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
