import { useCallback, useRef, useState } from 'react';
import {
    ArrowUp,
    Loader2,
    SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useGraphStore } from '@/state/graphStore';
import type { Schemas } from '@/types/api';
import {
    AskFiltersPopover,
    countActiveFilters,
} from './AskFiltersPopover';
import { AskAnswerPanel } from './AskAnswerPanel';

type AskFilters = Schemas['AskFiltersDto'];

export function AskBox() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const setHighlightedPath = useGraphStore((s) => s.setHighlightedPath);
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<AskFilters>({});
    const [filtersOpen, setFiltersOpen] = useState(false);
    const filtersAnchorRef = useRef<HTMLDivElement>(null);

    const ask = $api.useMutation('post', '/ask', {
        onSuccess: (data: Schemas['AskResponse']) => {
            const ids = (data.entities ?? [])
                .map((e) => e.id)
                .filter((id): id is string => !!id);
            setHighlightedPath(ids.length > 0 ? ids : null);
        },
    });

    const activeFilterCount = countActiveFilters(filters);
    const hasResult = ask.data || ask.isPending || ask.isError;

    // Keep latest values in refs so handleSend stays referentially stable,
    // which lets memo on AskAnswerPanel actually skip re-renders.
    const latest = useRef({ query, filters, activeFilterCount, selectedWorkspaceId });
    latest.current = { query, filters, activeFilterCount, selectedWorkspaceId };

    const handleSend = useCallback(() => {
        const { query: q, filters: f, activeFilterCount: count, selectedWorkspaceId: ws } = latest.current;
        const trimmed = q.trim();
        if (!trimmed || !ws || ask.isPending) return;
        ask.mutate({
            body: {
                workspaceId: ws,
                query: trimmed,
                ...(count > 0 ? { filters: f } : {}),
            },
        });
    }, [ask]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDismiss = useCallback(() => {
        ask.reset();
        setHighlightedPath(null);
    }, [ask, setHighlightedPath]);

    const errorMessage =
        ask.error instanceof Error ? ask.error.message : undefined;

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(720px,calc(100%-2rem))]">
            {hasResult && (
                <AskAnswerPanel
                    isPending={ask.isPending}
                    isError={ask.isError}
                    errorMessage={errorMessage}
                    data={ask.data}
                    onDismiss={handleDismiss}
                    onRetry={handleSend}
                />
            )}

            <div className="relative bg-card border rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-ring/40 transition-shadow">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your knowledge graph…"
                    rows={1}
                    disabled={!selectedWorkspaceId}
                    className="block w-full resize-none bg-transparent text-sm leading-6 text-foreground placeholder:text-muted-foreground/70 px-4 pt-3.5 pb-2 outline-none disabled:cursor-not-allowed disabled:opacity-60 min-h-[56px] max-h-40 field-sizing-content"
                />

                <div className="flex items-center justify-between px-2 pb-2">
                    <div ref={filtersAnchorRef} className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => setFiltersOpen((v) => !v)}
                            aria-expanded={filtersOpen}
                        >
                            <SlidersHorizontal className="size-3.5" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="ml-0.5 h-4 min-w-4 px-1 text-[10px]"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                        <AskFiltersPopover
                            anchorRef={filtersAnchorRef}
                            open={filtersOpen}
                            onClose={() => setFiltersOpen(false)}
                            filters={filters}
                            onChange={setFilters}
                        />
                    </div>

                    <Button
                        type="button"
                        size="icon"
                        className="size-8 rounded-full"
                        onClick={handleSend}
                        disabled={
                            !query.trim() ||
                            !selectedWorkspaceId ||
                            ask.isPending
                        }
                        aria-label="Send"
                    >
                        {ask.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <ArrowUp className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
