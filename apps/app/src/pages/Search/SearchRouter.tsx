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
import { Loader2 } from 'lucide-react';

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

    // Alternatives view always renders the default search page
    if (isAlternativesView) {
        return <SearchResultsPage />;
    }

    // While loading the initial response, show a loading state
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
            </AppLayout>
        );
    }

    // Determine which component to render based on responseType
    const responseType = searchResults?.answer?.responseType?.toUpperCase();
    const PageComponent = responseType
        ? RESPONSE_TYPE_MAP[responseType]
        : undefined;

    // If we have a matching specialized page, render it
    if (PageComponent) {
        return <PageComponent />;
    }

    // Default: render the standard search results page
    return <SearchResultsPage />;
}
