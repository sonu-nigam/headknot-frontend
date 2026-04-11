import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { useAppStore } from '@/state/store';
import { $api } from '@workspace/api-client';
import { Schemas } from '@/types/api';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import {
    Sparkles,
    FileText,
    Code,
    BookOpen,
    Clock,
    Loader2,
    SearchIcon,
    LinkIcon,
    ExternalLink,
    ArrowLeft,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

// --- Primary Answer (default fallback when no responseType) ---

function PrimaryAnswer({
    query,
    answer,
    onSourceClick,
}: {
    query: string;
    answer?: Schemas['SearchResponse']['answer'];
    onSourceClick: (item: Schemas['SearchResultItem']) => void;
}) {
    const hasAnswer = answer?.text;

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

                {hasAnswer ? (
                    <>
                        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                            {answer.text}
                        </p>
                        {answer.sources && answer.sources.length > 0 && (
                            <div className="pt-4 border-t border-primary/10 space-y-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Sources
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {answer.sources.map((source, i) => (
                                        <button
                                            key={source.entityId ?? i}
                                            onClick={() => onSourceClick(source)}
                                            className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sm border hover:border-primary/30 transition-colors cursor-pointer text-left"
                                        >
                                            <LinkIcon className="size-3 text-primary shrink-0" />
                                            <span className="text-xs font-medium truncate">
                                                {source.title || 'Untitled'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                            Results for &ldquo;
                            <span className="text-primary font-bold">{query}</span>
                            &rdquo;
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Based on your connected sources, here are the most
                            relevant results across your knowledge base.
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}

// --- Entity type config ---

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

// --- Result Item ---

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
                        <Badge variant="secondary" className="text-[10px] py-0">
                            {item.entitySubtype}
                        </Badge>
                    )}
                </div>
                <h4 className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                    {item.title || 'Untitled'}
                </h4>
                {item.snippet && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
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
            <ExternalLink className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground mt-1 shrink-0 transition-colors" />
        </div>
    );
}

// --- Main Page: Alternatives list + default answer fallback ---

export function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const isAlternativesView = searchParams.get('view') === 'alternatives';
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const [limit, setLimit] = useState(10);

    const { data: searchResults, isLoading } = $api.useQuery("get", "/search", {
        params: { query: { workspaceId: selectedWorkspaceId ?? '', query, limit } },
    }, { enabled: !!query && !!selectedWorkspaceId });

    const answer = searchResults?.answer;
    const alternatives = searchResults?.alternatives ?? [];

    const handleResultClick = (item: Schemas['SearchResultItem']) => {
        if (item.entityType?.toUpperCase() === 'MEMORY' && item.entityId) {
            navigate(`/${convertMemoryIdToSlug(item.entityId)}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                {
                    label: isAlternativesView
                        ? 'Alternative Results'
                        : 'Search Results',
                },
            ]}
        >
            <main className="flex-1 overflow-y-auto relative">
                <div className="max-w-4xl mx-auto space-y-8 p-8 md:p-12 pb-32">
                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                <Loader2 className="size-8 animate-spin" />
                                <p className="text-sm font-medium">
                                    Searching...
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {/* Back button for alternatives view */}
                            {isAlternativesView && (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() =>
                                            navigate(
                                                `/search?q=${encodeURIComponent(query)}`
                                            )
                                        }
                                    >
                                        <ArrowLeft className="size-4" />
                                        Back to answer
                                    </Button>
                                </div>
                            )}

                            {/* Alternatives view header */}
                            {isAlternativesView && (
                                <section className="p-8 rounded-xl bg-gradient-to-br from-muted to-muted/50 border">
                                    <h2 className="text-xl font-bold">
                                        Alternative Results
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Other relevant results for &ldquo;
                                        {query}&rdquo; from your knowledge base.
                                    </p>
                                </section>
                            )}

                            {/* Default answer (when SearchRouter falls through with no responseType) */}
                            {!isAlternativesView && query && (
                                <PrimaryAnswer
                                    query={query}
                                    answer={answer}
                                    onSourceClick={handleResultClick}
                                />
                            )}

                            {/* Alternatives list */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-muted-foreground px-2">
                                    {alternatives.length} Alternative
                                    {alternatives.length !== 1 ? 's' : ''}
                                </h3>

                                {alternatives.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <SearchIcon className="size-10 mb-4" />
                                        <p className="text-sm font-medium">
                                            No alternative results available.
                                        </p>
                                    </div>
                                )}

                                {alternatives.map((item) => (
                                    <ResultItem
                                        key={item.entityId}
                                        item={item}
                                        onClick={() =>
                                            handleResultClick(item)
                                        }
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {alternatives.length > 0 &&
                                alternatives.length >= limit && (
                                    <div className="flex justify-center pt-8">
                                        <Button
                                            variant="secondary"
                                            className="rounded-full"
                                            onClick={() =>
                                                setLimit((l) => l + 10)
                                            }
                                        >
                                            Load more results
                                        </Button>
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </main>
            <StickyPromptBox />
        </AppLayout>
    );
}
