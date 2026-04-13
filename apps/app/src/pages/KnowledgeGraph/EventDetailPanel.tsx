import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { X, Loader2, Trash2 } from 'lucide-react';
import { $api } from '@workspace/api-client';
import { useDeleteGraphEvent } from '@/hooks/graph/useDeleteGraphEvent';
import { ENTITY_COLORS, ENTITY_TYPE_LABELS, normalizeEntityType } from './constants';

interface EventDetailPanelProps {
    eventId: string;
    onClose: () => void;
    onSelectNode: (id: string, type: 'entity' | 'event') => void;
}

export function EventDetailPanel({
    eventId,
    onClose,
    onSelectNode,
}: EventDetailPanelProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { data: event, isLoading } = $api.useQuery(
        "get", "/events/{id}",
        { params: { path: { id: eventId } } },
        { enabled: !!eventId },
    );

    const deleteMutation = useDeleteGraphEvent();

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        deleteMutation.mutate({ params: { path: { id: eventId } } }, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="absolute right-0 top-0 w-80 bg-card border-l h-full overflow-y-auto z-20 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="min-w-0 flex-1">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            <span className="text-sm">Loading...</span>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-sm font-semibold truncate">
                                {event?.eventType ?? 'Event'}
                            </h2>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                Event Node
                            </p>
                        </div>
                    )}
                </div>
                <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex-1 p-4 space-y-5">
                    {/* Description */}
                    {event?.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {event.description}
                        </p>
                    )}

                    {/* Confidence */}
                    {event?.confidence !== undefined && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${Math.round(event.confidence * 100)}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono font-medium">
                                {Math.round(event.confidence * 100)}%
                            </span>
                        </div>
                    )}

                    {/* Temporal Info */}
                    {(event?.validFrom || event?.temporalType) && (
                        <div className="space-y-1.5">
                            {event?.temporalType && (
                                <Badge variant="outline" className="text-[10px]">
                                    {event.temporalType}
                                </Badge>
                            )}
                            {event?.validFrom && (
                                <p className="text-xs text-muted-foreground">
                                    From: {new Date(event.validFrom).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </p>
                            )}
                            {event?.validTo && (
                                <p className="text-xs text-muted-foreground">
                                    To: {new Date(event.validTo).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Subject Entity */}
                    <Separator />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Subject
                        </h3>
                        {event?.subject ? (
                            <button
                                onClick={() =>
                                    event.subject?.id &&
                                    onSelectNode(event.subject.id, 'entity')
                                }
                                className="w-full text-left rounded-lg border px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="size-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                ENTITY_COLORS[normalizeEntityType(event.subject.entityType)] ?? ENTITY_COLORS.other,
                                        }}
                                    />
                                    <p className="text-xs font-medium truncate">
                                        {event.subject.name ?? 'Unnamed'}
                                    </p>
                                    <Badge variant="outline" className="ml-auto text-[10px] shrink-0">
                                        {ENTITY_TYPE_LABELS[normalizeEntityType(event.subject.entityType)] ?? event.subject.entityType}
                                    </Badge>
                                </div>
                            </button>
                        ) : (
                            <p className="text-xs text-muted-foreground">No subject entity.</p>
                        )}
                    </div>

                    {/* Object Entity */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Object
                        </h3>
                        {event?.object ? (
                            <button
                                onClick={() =>
                                    event.object?.id &&
                                    onSelectNode(event.object.id, 'entity')
                                }
                                className="w-full text-left rounded-lg border px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="size-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                ENTITY_COLORS[normalizeEntityType(event.object.entityType)] ?? ENTITY_COLORS.other,
                                        }}
                                    />
                                    <p className="text-xs font-medium truncate">
                                        {event.object.name ?? 'Unnamed'}
                                    </p>
                                    <Badge variant="outline" className="ml-auto text-[10px] shrink-0">
                                        {ENTITY_TYPE_LABELS[normalizeEntityType(event.object.entityType)] ?? event.object.entityType}
                                    </Badge>
                                </div>
                            </button>
                        ) : (
                            <p className="text-xs text-muted-foreground">No object entity.</p>
                        )}
                    </div>

                    {/* Metadata */}
                    {event?.metadata && Object.keys(event.metadata).length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    Metadata
                                </h3>
                                <div className="space-y-1.5">
                                    {Object.entries(event.metadata).map(([key, value]) => (
                                        <div key={key} className="flex items-start justify-between gap-2 text-xs">
                                            <span className="text-muted-foreground font-medium">{key}</span>
                                            <span className="text-right truncate max-w-[60%]">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Delete Button */}
            <div className="p-4 border-t">
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                    ) : (
                        <Trash2 className="size-3" />
                    )}
                    {confirmDelete ? 'Confirm Delete' : 'Delete Event'}
                </Button>
                {confirmDelete && !deleteMutation.isPending && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-1 text-xs"
                        onClick={() => setConfirmDelete(false)}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
}
