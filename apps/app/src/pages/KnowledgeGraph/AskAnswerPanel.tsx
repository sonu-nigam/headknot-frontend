import { memo } from 'react';
import { Loader2, X, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { useGraphStore } from '@/state/graphStore';
import type { Schemas } from '@/types/api';

interface AskAnswerPanelProps {
    isPending: boolean;
    isError: boolean;
    errorMessage?: string;
    data?: Schemas['AskResponse'];
    onDismiss: () => void;
    onRetry: () => void;
}

function AskAnswerPanelImpl({
    isPending,
    isError,
    errorMessage,
    data,
    onDismiss,
    onRetry,
}: AskAnswerPanelProps) {
    const selectNode = useGraphStore((s) => s.selectNode);

    return (
        <div className="bg-card border rounded-2xl shadow-xl mb-3 max-h-[60vh] overflow-y-auto">
            <div className="sticky top-0 bg-card flex items-center justify-between px-4 py-2.5 border-b z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Answer
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onDismiss}
                    aria-label="Dismiss answer"
                >
                    <X className="size-4" />
                </Button>
            </div>

            <div className="p-4 space-y-4">
                {isPending && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Thinking…
                    </div>
                )}

                {isError && (
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-destructive">
                            <AlertCircle className="size-4 shrink-0 mt-0.5" />
                            <p>{errorMessage ?? 'Failed to fetch an answer.'}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={onRetry}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {!isPending && !isError && data && (
                    <>
                        {data.answer ? (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {data.answer}
                            </p>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">
                                No answer returned.
                            </p>
                        )}

                        {(data.entities ?? []).length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Cited entities
                                        </h4>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] px-1.5 py-0"
                                        >
                                            {data.entities?.length}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {data.entities?.map((entity) => (
                                            <button
                                                key={entity.id ?? entity.name}
                                                type="button"
                                                onClick={() =>
                                                    entity.id &&
                                                    selectNode(entity.id, 'entity')
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 hover:bg-muted text-xs px-2.5 py-1 transition-colors"
                                                disabled={!entity.id}
                                            >
                                                <span className="font-medium">
                                                    {entity.name ?? 'Unknown'}
                                                </span>
                                                {entity.type && (
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                        {entity.type}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {(data.sources ?? []).length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Sources
                                        </h4>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] px-1.5 py-0"
                                        >
                                            {data.sources?.length}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {data.sources?.map((source, idx) => (
                                            <div
                                                key={source.documentId ?? idx}
                                                className="rounded-lg border px-3 py-2 space-y-1"
                                            >
                                                {source.excerpt && (
                                                    <p className="text-xs leading-relaxed line-clamp-3">
                                                        {source.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between gap-2">
                                                    {source.sourceType && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-[10px] px-1.5 py-0 capitalize"
                                                        >
                                                            {source.sourceType
                                                                .toLowerCase()
                                                                .replace(/_/g, ' ')}
                                                        </Badge>
                                                    )}
                                                    {source.sourceUrl && (
                                                        <a
                                                            href={source.sourceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                                                        >
                                                            Open
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export const AskAnswerPanel = memo(AskAnswerPanelImpl);
