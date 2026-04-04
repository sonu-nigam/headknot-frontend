import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import {
    User,
    MapPin,
    Building2,
    Lightbulb,
    Cpu,
    CalendarDays,
    CircleDot,
    Loader2,
    Layers,
    Filter,
    Clock,
    MousePointerClick,
    LayoutGrid,
    Circle as CircleIcon,
    Waypoints,
    GitBranch,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { entitiesByWorkspaceQueryOptions } from '@/query/options/knowledge';
import { Schemas } from '@/types/api';

// --- Helpers ---

type EntityType = NonNullable<Schemas['EntityResponse']['entityType']>;

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
    person: 'Person',
    place: 'Place',
    organization: 'Organization',
    concept: 'Concept',
    technology: 'Technology',
    event: 'Event',
    other: 'Other',
};

function entityTypeIcon(type?: EntityType) {
    const cls = 'size-4';
    switch (type) {
        case 'person':
            return <User className={cls} />;
        case 'place':
            return <MapPin className={cls} />;
        case 'organization':
            return <Building2 className={cls} />;
        case 'concept':
            return <Lightbulb className={cls} />;
        case 'technology':
            return <Cpu className={cls} />;
        case 'event':
            return <CalendarDays className={cls} />;
        default:
            return <CircleDot className={cls} />;
    }
}

function entityTypeColor(type?: EntityType) {
    switch (type) {
        case 'concept':
            return 'bg-purple-500';
        case 'technology':
            return 'bg-cyan-500';
        case 'person':
            return 'bg-green-500';
        case 'organization':
            return 'bg-amber-500';
        case 'place':
            return 'bg-blue-500';
        case 'event':
            return 'bg-pink-500';
        default:
            return 'bg-muted-foreground';
    }
}

function entityCardBorder(type?: EntityType) {
    switch (type) {
        case 'concept':
            return 'border-purple-500/30 hover:border-purple-500/60';
        case 'technology':
            return 'border-cyan-500/30 hover:border-cyan-500/60';
        case 'person':
            return 'border-green-500/30 hover:border-green-500/60';
        case 'organization':
            return 'border-amber-500/30 hover:border-amber-500/60';
        case 'place':
            return 'border-blue-500/30 hover:border-blue-500/60';
        case 'event':
            return 'border-pink-500/30 hover:border-pink-500/60';
        default:
            return 'border-border hover:border-muted-foreground/50';
    }
}

// --- Toolbar ---

type ToolbarItem = { icon: React.ReactNode; label: string; id: string };

const toolbarItems: ToolbarItem[] = [
    {
        icon: <GitBranch className="size-4" />,
        label: 'Nodes',
        id: 'nodes',
    },
    {
        icon: <Filter className="size-4" />,
        label: 'Filters',
        id: 'filters',
    },
    {
        icon: <Clock className="size-4" />,
        label: 'Timeline',
        id: 'timeline',
    },
    {
        icon: <Layers className="size-4" />,
        label: 'Layers',
        id: 'layers',
    },
];

// --- Legend ---

const entityLegend: { label: string; color: string }[] = [
    { label: 'Concept', color: 'bg-purple-500' },
    { label: 'Technology', color: 'bg-cyan-500' },
    { label: 'Person', color: 'bg-green-500' },
    { label: 'Organization', color: 'bg-amber-500' },
];

const relLegend: { label: string; color: string; style: string }[] = [
    { label: 'Supports', color: 'bg-green-500', style: 'solid' },
    { label: 'References', color: 'bg-muted-foreground', style: 'solid' },
    { label: 'Contradicts', color: 'bg-red-500', style: 'solid' },
];

// --- Main Page ---

export function KnowledgeGraphPage() {
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [layout, setLayout] = useState<'force' | 'circle' | 'grid'>('grid');
    const [activeTool, setActiveTool] = useState('nodes');

    const { data: entities, isLoading } = useQuery({
        ...entitiesByWorkspaceQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
        }),
        enabled: !!selectedWorkspaceId,
    });

    const entityList = entities ?? [];

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Knowledge Graph' },
            ]}
        >
            <div className="flex-1 flex overflow-hidden">
                {/* Left Toolbar */}
                <div className="w-12 bg-card border-r flex flex-col items-center py-3 gap-1 shrink-0">
                    {toolbarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTool(item.id)}
                            title={item.label}
                            className={`size-9 rounded-lg flex items-center justify-center transition-colors ${
                                activeTool === item.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top Bar */}
                    <div className="h-12 bg-card border-b flex items-center justify-between px-4 shrink-0">
                        {/* Layout Mode */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant={
                                    layout === 'force' ? 'default' : 'ghost'
                                }
                                size="sm"
                                className="h-7 text-xs gap-1.5"
                                onClick={() => setLayout('force')}
                            >
                                <Waypoints className="size-3" />
                                Force
                            </Button>
                            <Button
                                variant={
                                    layout === 'circle' ? 'default' : 'ghost'
                                }
                                size="sm"
                                className="h-7 text-xs gap-1.5"
                                onClick={() => setLayout('circle')}
                            >
                                <CircleIcon className="size-3" />
                                Circle
                            </Button>
                            <Button
                                variant={
                                    layout === 'grid' ? 'default' : 'ghost'
                                }
                                size="sm"
                                className="h-7 text-xs gap-1.5"
                                onClick={() => setLayout('grid')}
                            >
                                <LayoutGrid className="size-3" />
                                Grid
                            </Button>
                        </div>

                        {/* Legend */}
                        <div className="hidden md:flex items-center gap-4">
                            {entityLegend.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-1.5"
                                >
                                    <div
                                        className={`size-2.5 rounded-full ${item.color}`}
                                    />
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                            <div className="h-4 w-px bg-border" />
                            {relLegend.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-1.5"
                                >
                                    <div
                                        className={`w-4 h-0.5 rounded-full ${item.color}`}
                                    />
                                    <span className="text-[10px] text-muted-foreground font-medium">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Canvas */}
                    <div
                        className="flex-1 relative overflow-auto"
                        style={{
                            backgroundImage:
                                'radial-gradient(#222242 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!isLoading && entityList.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                                <MousePointerClick className="size-8" />
                                <p className="text-sm font-medium">
                                    No entities to display
                                </p>
                                <p className="text-xs">
                                    Create entities to see them in the graph.
                                </p>
                            </div>
                        )}

                        {!isLoading && entityList.length > 0 && (
                            <div className="p-6">
                                {/* Placeholder message */}
                                <div className="text-center mb-6">
                                    <p className="text-xs text-muted-foreground">
                                        Graph visualization — click entities to
                                        explore
                                    </p>
                                </div>

                                {/* Entity node cards in grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {entityList.map((entity) => (
                                        <button
                                            key={entity.id}
                                            onClick={() =>
                                                navigate(
                                                    `/entities/${entity.id}`,
                                                )
                                            }
                                            className={`bg-card/80 backdrop-blur-sm border rounded-xl p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer ${entityCardBorder(entity.entityType)}`}
                                        >
                                            {/* Type indicator dot */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div
                                                    className={`size-2.5 rounded-full ${entityTypeColor(entity.entityType)}`}
                                                />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                    {ENTITY_TYPE_LABELS[
                                                        entity.entityType ??
                                                            'other'
                                                    ] ?? 'Other'}
                                                </span>
                                            </div>

                                            {/* Icon */}
                                            <div className="size-8 rounded-lg bg-muted flex items-center justify-center mb-2">
                                                {entityTypeIcon(
                                                    entity.entityType,
                                                )}
                                            </div>

                                            {/* Name */}
                                            <p className="text-sm font-semibold truncate">
                                                {entity.name}
                                            </p>

                                            {/* Aliases */}
                                            {entity.aliases &&
                                                entity.aliases.length > 0 && (
                                                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                                                        {entity.aliases
                                                            .slice(0, 2)
                                                            .join(', ')}
                                                        {entity.aliases
                                                            .length > 2 &&
                                                            ` +${entity.aliases.length - 2}`}
                                                    </p>
                                                )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Bar */}
                    <div className="h-8 bg-card border-t flex items-center px-4 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Showing {entityList.length} entities
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
