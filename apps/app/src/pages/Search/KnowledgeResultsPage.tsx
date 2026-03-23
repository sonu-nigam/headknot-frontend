import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import { Schemas } from '@/types/api';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import {
    Sparkles,
    FileText,
    Code,
    MessageSquare,
    BookOpen,
    ExternalLink,
    Clock,
    Globe,
    Shield,
    Database,
    BarChart3,
    History,
    UserSearch,
    Loader2,
    SearchIcon,
    Hash,
} from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

// --- Synthesized Answer ---

function SynthesizedAnswer({
    query,
    results,
}: {
    query: string;
    results: Schemas['SearchResultItem'][];
}) {
    return (
        <section className="relative">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    Cognitive Synthesis
                </span>
                <div className="h-px flex-grow bg-border" />
            </div>
            <div className="p-8 rounded-xl shadow-sm border relative overflow-hidden bg-card">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-30" />
                <div className="relative z-10 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {query || 'Knowledge Discovery'}
                    </h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed max-w-4xl">
                        <p className="text-lg">
                            Found{' '}
                            <span className="font-semibold text-foreground">
                                {results.length} relevant results
                            </span>{' '}
                            across your connected knowledge sources. Results are
                            synthesized and ranked by contextual relevance to
                            your query.
                        </p>
                    </div>
                    <div className="pt-6 border-t flex flex-wrap gap-3">
                        <span className="text-xs font-bold text-muted-foreground mr-2 self-center">
                            SOURCES:
                        </span>
                        {results.slice(0, 3).map((item, i) => (
                            <div
                                key={item.entityId ?? i}
                                className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border cursor-pointer hover:bg-muted/80 transition-colors"
                            >
                                <FileText className="size-3 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">
                                    [{i + 1}] {item.title ?? 'Untitled'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Evidence Node Cards ---

const ENTITY_STYLES: Record<
    string,
    { bg: string; icon: React.ReactNode; label: string }
> = {
    MEMORY: {
        bg: 'bg-primary/10 text-primary',
        icon: <FileText className="size-5" />,
        label: 'Memory',
    },
    SPACE: {
        bg: 'bg-blue-600/10 text-blue-600',
        icon: <BookOpen className="size-5 text-white" />,
        label: 'Space',
    },
    WORKSPACE: {
        bg: 'bg-zinc-900/10 text-zinc-900 dark:text-zinc-100',
        icon: <Code className="size-5" />,
        label: 'Workspace',
    },
};

function getStyle(entityType?: string) {
    return (
        ENTITY_STYLES[entityType?.toUpperCase() ?? ''] ?? {
            bg: 'bg-primary/10 text-primary',
            icon: <FileText className="size-5" />,
            label: entityType ?? 'Unknown',
        }
    );
}

// Wide card (col-span-8)
function WideEvidenceCard({
    item,
    onClick,
}: {
    item: Schemas['SearchResultItem'];
    onClick: () => void;
}) {
    const style = getStyle(item.entityType);
    return (
        <div
            onClick={onClick}
            className="col-span-12 md:col-span-8 p-6 rounded-lg shadow-sm border group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer bg-card"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`size-8 rounded ${style.bg} flex items-center justify-center`}
                    >
                        {style.icon}
                    </div>
                    <div>
                        <div className="text-xs font-bold tracking-tight">
                            {style.label}
                            {item.entityId &&
                                ` • ${item.entityId.slice(0, 8)}`}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">
                            Recently updated
                        </div>
                    </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h4 className="text-base font-bold tracking-tight mb-2">
                {item.title || 'Untitled'}
            </h4>
            {item.snippet && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {item.snippet}
                </p>
            )}
            <div className="flex gap-2">
                {item.entityType && (
                    <Badge variant="secondary" className="text-[10px]">
                        {item.entityType}
                    </Badge>
                )}
                {item.entitySubtype && (
                    <Badge variant="secondary" className="text-[10px]">
                        {item.entitySubtype}
                    </Badge>
                )}
            </div>
        </div>
    );
}

// Tall card (col-span-4 row-span-2)
function TallEvidenceCard({
    item,
    onClick,
}: {
    item: Schemas['SearchResultItem'];
    onClick: () => void;
}) {
    const style = getStyle(item.entityType);
    return (
        <div
            onClick={onClick}
            className="col-span-12 md:col-span-4 md:row-span-2 p-6 rounded-lg shadow-sm border group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer flex flex-col bg-card"
        >
            <div className="flex items-start justify-between mb-6">
                <div
                    className={`size-10 rounded-full ${style.bg} flex items-center justify-center`}
                >
                    {style.icon}
                </div>
                <Badge variant="secondary" className="text-[10px]">
                    {style.label}
                </Badge>
            </div>
            <h4 className="text-lg font-bold tracking-tight leading-snug mb-4">
                {item.title || 'Untitled'}
            </h4>
            <div className="space-y-4 flex-grow">
                {item.snippet && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.snippet}
                    </p>
                )}
            </div>
            <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-3" />
                    Recently updated
                </div>
                {item.entitySubtype && (
                    <span className="text-[10px] font-bold text-primary">
                        {item.entitySubtype}
                    </span>
                )}
            </div>
        </div>
    );
}

// Standard card (col-span-4)
function StandardEvidenceCard({
    item,
    onClick,
}: {
    item: Schemas['SearchResultItem'];
    onClick: () => void;
}) {
    const style = getStyle(item.entityType);
    return (
        <div
            onClick={onClick}
            className="col-span-12 md:col-span-4 p-6 rounded-lg shadow-sm border group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer bg-card"
        >
            <div className="flex items-center gap-2 mb-4">
                <div
                    className={`size-6 rounded-sm ${style.bg} flex items-center justify-center`}
                >
                    {React.cloneElement(style.icon as React.ReactElement, {
                        className: 'size-3',
                    })}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {style.label}
                </span>
            </div>
            <h4 className="text-sm font-bold mb-2">
                {item.title || 'Untitled'}
            </h4>
            {item.snippet && (
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {item.snippet}
                </p>
            )}
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <Clock className="size-3" />
                Recently updated
            </div>
        </div>
    );
}

// Visual topology card
function TopologyCard() {
    return (
        <div className="col-span-12 md:col-span-4 rounded-lg shadow-sm border group hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer overflow-hidden flex flex-col bg-card">
            <div className="p-4 border-b flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Logic Topology
                </span>
                <Hash className="size-3 text-muted-foreground" />
            </div>
            <div className="flex-grow p-4 relative bg-muted/30">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="size-10 rounded-lg bg-muted border flex items-center justify-center">
                            <Globe className="size-4" />
                        </div>
                        <div className="h-px w-8 bg-border relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1 rounded-full bg-muted-foreground" />
                        </div>
                        <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Shield className="size-4 text-primary" />
                        </div>
                        <div className="h-px w-8 bg-border relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1 rounded-full bg-muted-foreground" />
                        </div>
                        <div className="size-10 rounded-lg bg-muted border flex items-center justify-center">
                            <Database className="size-4" />
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-[10px] text-center text-muted-foreground italic">
                    Connections identified across knowledge nodes
                </div>
            </div>
        </div>
    );
}

// --- Inferred Nodes (follow-up questions) ---

function InferredNodes({ query }: { query: string }) {
    const suggestions = [
        {
            icon: <BarChart3 className="size-4" />,
            text: `How does this impact performance?`,
        },
        {
            icon: <History className="size-4" />,
            text: `View related audit history`,
        },
        {
            icon: <UserSearch className="size-4" />,
            text: `Who owns this area?`,
        },
    ];

    return (
        <section className="mt-12">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    Inferred Nodes
                </h3>
                <div className="h-px flex-grow bg-border" />
            </div>
            <div className="flex flex-wrap gap-3">
                {suggestions.map((s) => (
                    <button
                        key={s.text}
                        className="flex items-center gap-2 px-4 py-2 bg-muted border rounded-lg text-xs font-semibold hover:bg-muted/80 transition-all"
                    >
                        {s.icon}
                        {s.text}
                    </button>
                ))}
            </div>
        </section>
    );
}

// --- Evidence Grid ---

function EvidenceGrid({
    results,
    onResultClick,
}: {
    results: Schemas['SearchResultItem'][];
    onResultClick: (item: Schemas['SearchResultItem']) => void;
}) {
    if (results.length === 0) return null;

    // Layout: first item = wide, second = tall (spans 2 rows), rest alternate standard
    return (
        <div className="grid grid-cols-12 gap-6">
            {results.map((item, i) => {
                if (i === 0) {
                    return (
                        <WideEvidenceCard
                            key={item.entityId ?? i}
                            item={item}
                            onClick={() => onResultClick(item)}
                        />
                    );
                }
                if (i === 1) {
                    return (
                        <TallEvidenceCard
                            key={item.entityId ?? i}
                            item={item}
                            onClick={() => onResultClick(item)}
                        />
                    );
                }
                if (i === 2) {
                    return (
                        <StandardEvidenceCard
                            key={item.entityId ?? i}
                            item={item}
                            onClick={() => onResultClick(item)}
                        />
                    );
                }
                if (i === 3) {
                    return <TopologyCard key="topology" />;
                }
                return (
                    <StandardEvidenceCard
                        key={item.entityId ?? i}
                        item={item}
                        onClick={() => onResultClick(item)}
                    />
                );
            })}
            {results.length <= 3 && <TopologyCard />}
        </div>
    );
}

// --- Main Page ---

import React from 'react';

export function KnowledgeResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const navigate = useNavigate();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
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
                { label: 'Knowledge Discovery' },
            ]}
        >
            <div className="flex-1 overflow-y-auto relative">
                <div className="pt-8 pb-32 px-8 md:px-12 max-w-6xl mx-auto space-y-10">
                    {/* Synthesized Answer */}
                    {query && (
                        <SynthesizedAnswer query={query} results={results} />
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && results.length === 0 && query && (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <SearchIcon className="size-10 mb-4" />
                            <p className="text-sm font-medium">
                                No knowledge nodes found for &ldquo;{query}
                                &rdquo;
                            </p>
                            <p className="text-xs mt-1">
                                Try adjusting your query or check connected
                                sources.
                            </p>
                        </div>
                    )}

                    {/* Evidence Nodes */}
                    {!isLoading && results.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                    Evidence Nodes
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="text-xs rounded-full"
                                    >
                                        All Sources
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs rounded-full text-muted-foreground"
                                    >
                                        Engineering
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs rounded-full text-muted-foreground"
                                    >
                                        Product
                                    </Button>
                                </div>
                            </div>
                            <EvidenceGrid
                                results={results}
                                onResultClick={handleResultClick}
                            />
                        </section>
                    )}

                    {/* Load More */}
                    {results.length > 0 && results.length >= limit && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="secondary"
                                className="rounded-full"
                                onClick={() => setLimit((l) => l + 10)}
                            >
                                Load more evidence
                            </Button>
                        </div>
                    )}

                    {/* Inferred Nodes */}
                    {!isLoading && query && (
                        <InferredNodes query={query} />
                    )}
                </div>
            </div>
            <StickyPromptBox />
        </AppLayout>
    );
}
