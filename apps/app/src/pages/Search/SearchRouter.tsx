import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/state/store';
import { searchQueryOptions } from '@/query/options/search';
import { SearchResultsPage } from './SearchResultsPage';
import { KnowledgeResultsPage } from './KnowledgeResultsPage';
import { CausalResultsPage } from './CausalResultsPage';
import { ProceduralResultsPage } from './ProceduralResultsPage';
import { ComparativeResultsPage } from './ComparativeResultsPage';
import { ImpactAnalysisPage } from './ImpactAnalysisPage';
import { ReasoningResultsPage } from './ReasoningResultsPage';
import AppLayout from '@/components/AppLayout';
import { Loader2, SearchIcon } from 'lucide-react';
import { StickyPromptBox } from '@/components/StickyPromptBox';

const RESPONSE_TYPE_MAP: Record<string, React.ComponentType> = {
    KNOWLEDGE: KnowledgeResultsPage,
    CAUSAL: CausalResultsPage,
    PROCEDURAL: ProceduralResultsPage,
    COMPARATIVE: ComparativeResultsPage,
    IMPACT: ImpactAnalysisPage,
    REASONING: ReasoningResultsPage,
};

export function SearchRouter() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const isAlternativesView = searchParams.get('view') === 'alternatives';
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: searchResults, isLoading } = useQuery({
        ...searchQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            query,
            limit: 10,
        }),
        enabled: !!query && !!selectedWorkspaceId,
    });

    // Loading state
    if (isLoading && !searchResults) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Search Results' },
                ]}
            >
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="text-sm font-medium">Searching...</p>
                    </div>
                </div>
                <StickyPromptBox />
            </AppLayout>
        );
    }

    // Alternatives view → show SearchResultsPage with alternatives list
    if (isAlternativesView) {
        return <SearchResultsPage />;
    }

    // Determine responseType
    const answer = searchResults?.answer;
    const responseType = answer?.responseType?.toUpperCase();
    const alternatives = searchResults?.alternatives ?? [];
    const hasAnswer = !!answer?.text;

    // No results at all → empty state
    if (!hasAnswer && alternatives.length === 0 && !isLoading) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Search Results' },
                ]}
            >
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center text-center space-y-3 text-muted-foreground">
                        <SearchIcon className="size-12" />
                        <h2 className="text-xl font-bold text-foreground">
                            No results found for &ldquo;{query}&rdquo;
                        </h2>
                        <p className="text-sm max-w-md">
                            We couldn't find a direct answer. Try rephrasing
                            your query or using different keywords.
                        </p>
                    </div>
                </div>
                <StickyPromptBox />
            </AppLayout>
        );
    }

    // Matched responseType → render the specialized page
    const PageComponent = responseType
        ? RESPONSE_TYPE_MAP[responseType]
        : undefined;

    if (PageComponent) {
        return <PageComponent />;
    }

    // Default fallback (answer exists but no responseType) → SearchResultsPage
    return <SearchResultsPage />;
}
