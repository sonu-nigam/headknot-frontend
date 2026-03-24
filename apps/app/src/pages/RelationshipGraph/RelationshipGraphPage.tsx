import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Lock,
    Database,
    User,
    Route,
    Plus,
    Minus,
    Filter,
    Share2,
    History,
    X,
    ExternalLink,
    CheckCircle,
} from 'lucide-react';

// --- Graph Node ---

interface GraphNode {
    id: string;
    label: string;
    icon: React.ReactNode;
    type: 'service' | 'resource' | 'actor' | 'pipeline';
    position: { top: string; left: string };
    size: 'lg' | 'md';
    isPrimary?: boolean;
}

const graphNodes: GraphNode[] = [
    {
        id: 'auth',
        label: 'Auth Service',
        icon: <Lock className="size-8 text-primary" />,
        type: 'service',
        position: { top: '50%', left: '50%' },
        size: 'lg',
        isPrimary: true,
    },
    {
        id: 'redis',
        label: 'Redis Cluster',
        icon: <Database className="size-6 text-muted-foreground" />,
        type: 'resource',
        position: { top: '30%', left: '20%' },
        size: 'md',
    },
    {
        id: 'sarah',
        label: 'Sarah Chen',
        icon: <User className="size-6 text-muted-foreground" />,
        type: 'actor',
        position: { top: '20%', left: '55%' },
        size: 'md',
    },
    {
        id: 'pipeline',
        label: 'Data Pipeline',
        icon: <Route className="size-6 text-muted-foreground" />,
        type: 'pipeline',
        position: { top: '70%', left: '70%' },
        size: 'md',
    },
];

// --- Graph Canvas ---

function GraphCanvas({
    onNodeSelect,
}: {
    onNodeSelect: (id: string) => void;
}) {
    return (
        <div className="flex-1 relative bg-[radial-gradient(circle_at_2px_2px,hsl(var(--muted))_1px,transparent_0)] bg-[length:40px_40px] flex items-center justify-center p-8 overflow-hidden">
            <div className="relative w-full h-full max-w-5xl max-h-[800px]">
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <path
                        d="M 200 300 Q 300 250 400 350"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeDasharray="4 2"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M 400 350 L 600 450"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                    />
                    <path
                        d="M 400 350 L 550 200"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M 600 450 Q 750 400 800 500"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeDasharray="4 2"
                        strokeWidth="1.5"
                    />
                </svg>

                {/* Nodes */}
                {graphNodes.map((node) => (
                    <div
                        key={node.id}
                        className="absolute group cursor-pointer"
                        style={{
                            top: node.position.top,
                            left: node.position.left,
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => onNodeSelect(node.id)}
                    >
                        <div className="flex flex-col items-center">
                            <div
                                className={`rounded-full bg-card flex items-center justify-center shadow-lg border group-hover:scale-110 transition-transform ${
                                    node.isPrimary
                                        ? 'size-20 border-2 border-primary/20 animate-pulse'
                                        : 'size-14 border-border'
                                }`}
                            >
                                {node.icon}
                            </div>
                            <div
                                className={`mt-3 px-2 py-0.5 rounded text-[10px] font-bold ${
                                    node.isPrimary
                                        ? 'bg-foreground text-background'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {node.label}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Relationship Tags */}
                <div className="absolute top-[42%] left-[45%] bg-muted px-2 py-1 rounded text-[10px] font-mono text-muted-foreground border rotate-[-15deg]">
                    depends_on
                </div>
                <div className="absolute top-[28%] left-[40%] bg-muted px-2 py-1 rounded text-[10px] font-mono text-destructive/70 border border-destructive/10 rotate-[25deg]">
                    contradicts
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="bg-card p-1 rounded-lg shadow-lg border flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 text-muted-foreground"
                    >
                        <Plus className="size-4" />
                    </Button>
                    <div className="h-px w-full bg-border" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 text-muted-foreground"
                    >
                        <Minus className="size-4" />
                    </Button>
                </div>
                <div className="bg-card px-4 py-2 rounded-lg shadow-lg border flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Auto-Layout
                        </span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                        Reset Focus
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Detail Panel ---

function DetailPanel({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    if (!open) return null;

    return (
        <aside className="absolute right-6 top-6 bottom-6 w-80 bg-card rounded-xl shadow-2xl flex flex-col overflow-hidden z-20 border">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                        Selected Entity
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={onClose}
                    >
                        <X className="size-3.5" />
                    </Button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Lock className="size-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight leading-tight">
                            Auth Service
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            System Microservice
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted p-3 rounded-md">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                            Health
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-semibold">
                                99.2%
                            </span>
                        </div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                            Claims
                        </p>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="size-3 text-primary" />
                            <span className="text-sm font-semibold">
                                42 Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Relationships & Activity */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-3">
                        Relationships
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                                    <Database className="size-3.5" />
                                </div>
                                <span className="text-xs font-medium">
                                    Redis Cluster
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                                depends_on
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                                    <User className="size-3.5" />
                                </div>
                                <span className="text-xs font-medium">
                                    Sarah Chen
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-destructive/60">
                                contradicts
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-3">
                        Activity Log
                    </h3>
                    <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-border">
                        <div className="flex gap-4 relative">
                            <div className="size-[22px] rounded-full bg-card border flex items-center justify-center z-10">
                                <span className="size-1.5 rounded-full bg-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-medium leading-tight">
                                    Policy update detected
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    2 hours ago
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative">
                            <div className="size-[22px] rounded-full bg-card border flex items-center justify-center z-10">
                                <span className="size-1.5 rounded-full bg-primary/30" />
                            </div>
                            <div>
                                <p className="text-xs font-medium leading-tight">
                                    Claim #821 validated
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    5 hours ago
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-muted">
                <Button className="w-full gap-2 text-xs">
                    <ExternalLink className="size-3.5" />
                    Open Full Audit
                </Button>
            </div>
        </aside>
    );
}

// --- Main Page ---

export function RelationshipGraphPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>('auth');

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Memory' },
                { label: 'Relationship Graph' },
            ]}
        >
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <GraphCanvas onNodeSelect={(id) => setSelectedNode(id)} />
                <DetailPanel
                    open={!!selectedNode}
                    onClose={() => setSelectedNode(null)}
                />

                {/* Floating Toolbar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card/60 backdrop-blur-xl border px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-30">
                    <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-foreground transition-colors">
                        <Filter className="size-4" />
                        Filter Nodes
                    </button>
                    <div className="h-4 w-px bg-border" />
                    <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-foreground transition-colors">
                        <Share2 className="size-4" />
                        Export Graph
                    </button>
                    <div className="h-4 w-px bg-border" />
                    <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-foreground transition-colors">
                        <History className="size-4" />
                        Snapshots
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
