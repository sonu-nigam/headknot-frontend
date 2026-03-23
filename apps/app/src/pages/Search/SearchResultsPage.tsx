import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Label } from '@workspace/ui/components/label';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import { Schemas } from '@/types/api';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import {
    Sparkles,
    CheckCircle,
    AlertCircle,
    FileText,
    Code,
    MessageSquare,
    BookOpen,
    Clock,
    User,
    Eye,
    MessageCircle,
    Loader2,
    SearchIcon,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

// --- Filter Sidebar ---

type SourceFilter = 'all' | 'jira' | 'github' | 'slack' | 'confluence';
type TimeFilter = '24h' | '7d' | '30d';

function FilterSidebar({
    sources,
    onSourcesChange,
    timeFilter,
    onTimeFilterChange,
}: {
    sources: SourceFilter[];
    onSourcesChange: (sources: SourceFilter[]) => void;
    timeFilter: TimeFilter;
    onTimeFilterChange: (t: TimeFilter) => void;
}) {
    const toggleSource = (source: SourceFilter) => {
        if (source === 'all') {
            onSourcesChange(['all']);
            return;
        }
        const without = sources.filter((s) => s !== 'all' && s !== source);
        if (sources.includes(source)) {
            onSourcesChange(without.length ? without : ['all']);
        } else {
            onSourcesChange([...without, source]);
        }
    };

    const sourceOptions: { value: SourceFilter; label: string }[] = [
        { value: 'all', label: 'All Sources' },
        { value: 'jira', label: 'Jira Software' },
        { value: 'github', label: 'GitHub' },
        { value: 'slack', label: 'Slack' },
        { value: 'confluence', label: 'Confluence' },
    ];

    const timeOptions: { value: TimeFilter; label: string }[] = [
        { value: '24h', label: 'Past 24h' },
        { value: '7d', label: 'Past 7 days' },
        { value: '30d', label: 'Past 30 days' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r p-6 gap-8">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Sources
                </h3>
                <div className="space-y-3">
                    {sourceOptions.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <Checkbox
                                checked={
                                    opt.value === 'all'
                                        ? sources.includes('all')
                                        : sources.includes(opt.value)
                                }
                                onCheckedChange={() => toggleSource(opt.value)}
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Timeframe
                </h3>
                <div className="space-y-3">
                    {timeOptions.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="timeFilter"
                                checked={timeFilter === opt.value}
                                onChange={() => onTimeFilterChange(opt.value)}
                                className="size-4 border-border text-primary focus:ring-primary/20"
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    File Type
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['Code', 'Doc', 'Ticket'].map((type) => (
                        <Badge key={type} variant="secondary" className="text-[10px] uppercase">
                            {type}
                        </Badge>
                    ))}
                </div>
            </div>
        </aside>
    );
}

// --- Synthesized Answer ---

function SynthesizedAnswer({ query }: { query: string }) {
    return (
        <section className="relative p-8 rounded-xl bg-gradient-to-br from-primary/5 via-muted to-primary/5 border border-primary/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                        Synthesized Answer
                    </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                    Results for &ldquo;
                    <span className="text-primary font-bold">{query}</span>
                    &rdquo;
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                    Based on your connected sources, here are the most relevant
                    results across your knowledge base. Results are ranked by
                    relevance and recency.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sm border">
                        <CheckCircle className="size-4 text-primary" />
                        <span className="text-xs font-medium">
                            Sources Searched
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sm border">
                        <AlertCircle className="size-4 text-destructive" />
                        <span className="text-xs font-medium">
                            AI-Ranked Results
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Result Item ---

const ENTITY_TYPE_CONFIG: Record<
    string,
    { icon: React.ReactNode; color: string; label: string }
> = {
    MEMORY: {
        icon: <FileText className="size-5" />,
        color: 'bg-primary/10 text-primary',
        label: 'Memory',
    },
    SPACE: {
        icon: <BookOpen className="size-5" />,
        color: 'bg-blue-500/10 text-blue-600',
        label: 'Space',
    },
    WORKSPACE: {
        icon: <Code className="size-5" />,
        color: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
        label: 'Workspace',
    },
};

function getConfig(entityType?: string) {
    return (
        ENTITY_TYPE_CONFIG[entityType?.toUpperCase() ?? ''] ?? {
            icon: <FileText className="size-5" />,
            color: 'bg-primary/10 text-primary',
            label: entityType ?? 'Unknown',
        }
    );
}

function ResultItem({
    item,
    onClick,
}: {
    item: Schemas['SearchResultItem'];
    onClick: () => void;
}) {
    const config = getConfig(item.entityType);

    return (
        <div
            onClick={onClick}
            className="group flex items-start gap-4 p-4 rounded-xl hover:bg-muted transition-all cursor-pointer border border-transparent hover:border-border"
        >
            <div
                className={`mt-1 shrink-0 size-10 rounded-lg ${config.color} flex items-center justify-center`}
            >
                {config.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground/60 uppercase">
                        {config.label}
                        {item.entityId && ` • ${item.entityId.slice(0, 8)}`}
                    </span>
                    {item.entitySubtype && (
                        <Badge
                            variant="secondary"
                            className="text-[10px] py-0"
                        >
                            {item.entitySubtype}
                        </Badge>
                    )}
                </div>
                <h4 className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                    {item.title || 'Untitled'}
                </h4>
                {item.snippet && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {item.snippet}
                    </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                        <Clock className="size-3" />
                        Recently updated
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const [sources, setSources] = useState<SourceFilter[]>(['all']);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('7d');
    const [limit, setLimit] = useState(10);

    const { data: searchResults, isLoading } = useQuery({
        ...searchQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            query,
            limit,
        }),
        enabled: !!query && !!selectedWorkspaceId,
    });

    const results = searchResults?.items ?? [];

    const handleResultClick = (item: Schemas['SearchResultItem']) => {
        if (item.entityType?.toUpperCase() === 'MEMORY' && item.entityId) {
            navigate(`/${convertMemoryIdToSlug(item.entityId)}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Search Results' },
            ]}
        >
            <div className="flex min-h-0 flex-1">
                {/* Filter Sidebar */}
                <FilterSidebar
                    sources={sources}
                    onSourcesChange={setSources}
                    timeFilter={timeFilter}
                    onTimeFilterChange={setTimeFilter}
                />

                {/* Main Content */}
                <main className="flex-1 min-w-0 overflow-y-auto relative">
                    <div className="max-w-4xl mx-auto space-y-10 p-8 md:p-12 pb-32">
                        {/* Synthesized Answer */}
                        {query && <SynthesizedAnswer query={query} />}

                        {/* Results List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-muted-foreground px-2">
                                    {isLoading
                                        ? 'Searching...'
                                        : `${results.length} Results found`}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Sort by:
                                    </span>
                                    <button className="text-xs font-semibold flex items-center gap-1">
                                        Relevance
                                    </button>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {!isLoading && results.length === 0 && query && (
                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                    <SearchIcon className="size-10 mb-4" />
                                    <p className="text-sm font-medium">
                                        No results found for &ldquo;{query}
                                        &rdquo;
                                    </p>
                                    <p className="text-xs mt-1">
                                        Try adjusting your filters or search
                                        terms.
                                    </p>
                                </div>
                            )}

                            {results.map((item) => (
                                <ResultItem
                                    key={item.entityId}
                                    item={item}
                                    onClick={() => handleResultClick(item)}
                                />
                            ))}
                        </div>

                        {/* Load More */}
                        {results.length > 0 && results.length >= limit && (
                            <div className="flex justify-center pt-8">
                                <Button
                                    variant="secondary"
                                    className="rounded-full"
                                    onClick={() => setLimit((l) => l + 10)}
                                >
                                    Load more results
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
