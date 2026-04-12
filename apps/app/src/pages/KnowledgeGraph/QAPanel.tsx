import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { Separator } from '@workspace/ui/components/separator';
import { Badge } from '@workspace/ui/components/badge';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@workspace/ui/components/collapsible';
import { X, Loader2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';

interface QAPanelProps {
    onClose: () => void;
}

export function QAPanel({ onClose }: QAPanelProps) {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [query, setQuery] = useState('');
    const [traceOpen, setTraceOpen] = useState(false);

    const reason = $api.useMutation("post", "/search/reason");

    const handleAsk = () => {
        if (!query.trim() || !selectedWorkspaceId) return;
        reason.mutate({
            params: { query: { workspaceId: selectedWorkspaceId } },
            body: { query: query.trim() },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleAsk();
        }
    };

    const data = reason.data;
    const sources = data?.sources ?? [];
    const trace = data?.reasoningTrace ?? [];
    const conflicts = data?.unresolvedConflicts ?? [];

    return (
        <div className="absolute top-16 left-16 w-80 bg-card rounded-xl border shadow-xl z-30 flex flex-col max-h-[calc(100%-5rem)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Q&A</h3>
                <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                {/* Input */}
                <div className="space-y-2">
                    <Textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about the graph..."
                        rows={3}
                        className="text-xs resize-none"
                    />
                    <Button
                        size="sm"
                        className="w-full gap-1.5 text-xs"
                        onClick={handleAsk}
                        disabled={!query.trim() || !selectedWorkspaceId || reason.isPending}
                    >
                        {reason.isPending ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : (
                            <Search className="size-3" />
                        )}
                        Ask
                    </Button>
                </div>

                {/* Loading */}
                {reason.isPending && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}

                {/* Error */}
                {reason.isError && (
                    <p className="text-xs text-destructive text-center py-2">
                        Failed to get answer. Please try again.
                    </p>
                )}

                {/* Results */}
                {data && !reason.isPending && (
                    <>
                        <Separator />

                        {/* Answer */}
                        {data.answer && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    Answer
                                </h4>
                                <p className="text-xs leading-relaxed">
                                    {data.answer}
                                </p>
                            </div>
                        )}

                        {/* Sources */}
                        {sources.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Sources
                                    </h4>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {sources.length}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    {sources.map((source, idx) => (
                                        <div
                                            key={source.claimId ?? idx}
                                            className="rounded-lg border px-3 py-2 space-y-0.5"
                                        >
                                            <p className="text-xs font-medium line-clamp-2" title={source.claimText ?? ''}>
                                                {source.claimText}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {source.sourceApp && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                        {source.sourceApp}
                                                    </Badge>
                                                )}
                                                {(source.validFrom || source.validTo) && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {source.validFrom && new Date(source.validFrom).toLocaleDateString()}
                                                        {source.validFrom && source.validTo && ' — '}
                                                        {source.validTo && new Date(source.validTo).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reasoning Trace */}
                        {trace.length > 0 && (
                            <Collapsible open={traceOpen} onOpenChange={setTraceOpen}>
                                <CollapsibleTrigger asChild>
                                    <button className="flex items-center gap-1.5 w-full">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Reasoning Trace
                                        </h4>
                                        {traceOpen ? (
                                            <ChevronUp className="size-3 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="size-3 text-muted-foreground" />
                                        )}
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="mt-2 space-y-1.5">
                                        {trace.map((step, idx) => (
                                            <div
                                                key={idx}
                                                className="border-l-2 border-muted pl-2 py-1"
                                            >
                                                <span className="text-[10px] font-semibold text-muted-foreground mr-1">
                                                    {idx + 1}.
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}

                        {/* Unresolved Conflicts */}
                        {conflicts.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Conflicts
                                    </h4>
                                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                        {conflicts.length}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    {conflicts.map((conflict, idx) => (
                                        <div
                                            key={conflict.conflictId ?? idx}
                                            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 space-y-1"
                                        >
                                            <p className="text-xs">{conflict.claim1Text}</p>
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
                                                vs
                                            </p>
                                            <p className="text-xs">{conflict.claim2Text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
