import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    SearchIcon,
    DatabaseIcon,
    ShieldAlertIcon,
    GitBranchIcon,
    ArrowUpRightIcon,
    TrendingUpIcon,
    MinusIcon,
    Loader2,
    NetworkIcon,
    FileTextIcon,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useSearchDialog } from '@/components/SearchCommandDialog';
import { useAppStore } from '@/state/store';
import { entitiesByWorkspaceQueryOptions } from '@/query/options/knowledge';
import { conflictsQueryOptions } from '@/query/options/conflicts';
import { Button } from '@workspace/ui/components/button';
import { formatDistanceToNow } from 'date-fns';

// --- Entity type color map ---

const entityTypeColors: Record<string, string> = {
    person: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    place: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    organization: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    concept: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    technology: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    event: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    other: 'bg-muted text-muted-foreground border-border',
};

// --- Stats Card ---

function StatCard({
    label,
    value,
    change,
    changeType,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral' | 'critical';
    icon: React.ElementType;
}) {
    const changeColor = {
        positive: 'text-green-400',
        negative: 'text-red-400',
        neutral: 'text-muted-foreground',
        critical: 'text-red-500',
    }[changeType ?? 'neutral'];

    const ChangeIcon =
        changeType === 'positive' || changeType === 'negative'
            ? TrendingUpIcon
            : MinusIcon;

    return (
        <div className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="size-4 text-muted-foreground" />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${changeColor}`}>
                        <ChangeIcon className="size-3" />
                        <span>{change}</span>
                    </div>
                )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {label}
            </p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    );
}

// --- Main Dashboard ---

export default function Dashboard() {
    const setSearchOpen = useSearchDialog((s) => s.setOpen);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const {
        data: entities,
        isLoading: entitiesLoading,
    } = useQuery({
        ...entitiesByWorkspaceQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
        }),
        enabled: !!selectedWorkspaceId,
    });

    const {
        data: conflicts,
        isLoading: conflictsLoading,
    } = useQuery({
        ...conflictsQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
        }),
        enabled: !!selectedWorkspaceId,
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Derived stats
    const totalEntities = entities?.length ?? 0;
    const activeConflicts = conflicts?.filter((c) => c.status === 'ACTIVE').length ?? 0;
    const recentEntities = entities?.slice(0, 6) ?? [];
    const activeConflictsList = conflicts?.filter((c) => c.status === 'ACTIVE').slice(0, 4) ?? [];
    const isLoading = entitiesLoading || conflictsLoading;

    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
                    {/* Header + Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                Overview of your knowledge workspace.
                            </p>
                        </div>
                        <form
                            onSubmit={handleSearchSubmit}
                            className="w-full max-w-sm bg-card border rounded-lg overflow-hidden hover:border-primary/50 transition-colors shadow-sm"
                        >
                            <div className="px-3 py-2 flex items-center gap-2 text-muted-foreground">
                                <SearchIcon className="size-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ask Headknot..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(true)}
                                    className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium hover:bg-muted/80"
                                >
                                    ⌘K
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {/* Stats Cards Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard
                                    label="Total Entities"
                                    value={totalEntities}
                                    change="+12%"
                                    changeType="positive"
                                    icon={DatabaseIcon}
                                />
                                <StatCard
                                    label="Active Claims"
                                    value={entities ? '---' : '---'}
                                    change="Stable"
                                    changeType="neutral"
                                    icon={FileTextIcon}
                                />
                                <StatCard
                                    label="Active Conflicts"
                                    value={activeConflicts}
                                    change={activeConflicts > 0 ? 'Critical' : 'Clear'}
                                    changeType={activeConflicts > 0 ? 'critical' : 'positive'}
                                    icon={ShieldAlertIcon}
                                />
                                <StatCard
                                    label="Relationships"
                                    value="---"
                                    change="+24 new"
                                    changeType="positive"
                                    icon={GitBranchIcon}
                                />
                            </div>

                            {/* Two-column layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Recent Entities */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                            Recent Entities
                                        </h2>
                                        <Link
                                            to="/entities"
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            View all
                                        </Link>
                                    </div>
                                    {recentEntities.length === 0 ? (
                                        <div className="bg-card border rounded-xl p-8 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                No entities yet. Start by adding memories.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {recentEntities.map((entity) => (
                                                <Link
                                                    key={entity.id}
                                                    to={`/entities/${entity.id}`}
                                                    className="block bg-card border rounded-xl p-4 hover:border-primary/30 transition-colors group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <span className="text-sm font-semibold truncate">
                                                                {entity.name}
                                                            </span>
                                                            {entity.entityType && (
                                                                <span
                                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${entityTypeColors[entity.entityType] ?? entityTypeColors.other}`}
                                                                >
                                                                    {entity.entityType}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Active Conflicts */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                            Active Conflicts
                                        </h2>
                                        <Link
                                            to="/conflicts"
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            View all
                                        </Link>
                                    </div>
                                    {activeConflictsList.length === 0 ? (
                                        <div className="bg-card border rounded-xl p-8 text-center">
                                            <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                                                <ShieldAlertIcon className="size-5 text-green-500" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                No active conflicts. Knowledge base is consistent.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {activeConflictsList.map((conflict) => (
                                                <Link
                                                    key={conflict.id}
                                                    to={`/conflicts/${conflict.id}`}
                                                    className="block bg-card border rounded-xl p-4 hover:border-red-500/30 transition-colors group"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold truncate">
                                                                {conflict.description || 'Unnamed conflict'}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                                                                    Active
                                                                </span>
                                                                {conflict.confidence != null && (
                                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                                        {Math.round(conflict.confidence * 100)}% confidence
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {conflict.createdAt
                                                                    ? formatDistanceToNow(new Date(conflict.createdAt), { addSuffix: true })
                                                                    : ''}
                                                            </span>
                                                            <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Network View CTA */}
                            <div className="bg-card border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <NetworkIcon className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">
                                            Knowledge Graph
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Explore entities and relationships in an interactive network view.
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="secondary" size="sm" className="gap-2">
                                    <Link to="/knowledge-graph">
                                        <NetworkIcon className="size-3.5" />
                                        Open Explorer
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
