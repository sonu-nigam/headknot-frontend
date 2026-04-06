import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { X, Loader2, Trash2 } from 'lucide-react';
import { graphEventByIdQueryOptions } from '@/query/options/graph';
import { useDeleteGraphEvent } from '@/hooks/graph/useDeleteGraphEvent';
import { ENTITY_COLORS, ENTITY_TYPE_LABELS } from './constants';

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

    const { data: event, isLoading } = useQuery(
        graphEventByIdQueryOptions(eventId),
    );

    const deleteMutation = useDeleteGraphEvent();

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        deleteMutation.mutate(eventId, {
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
                        <h2 className="text-sm font-semibold truncate">
                            {event?.label ?? 'Untitled Event'}
                        </h2>
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

                    {/* Occurred At */}
                    {event?.occurredAt && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                Occurred
                            </h3>
                            <p className="text-sm">
                                {new Date(event.occurredAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
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
                                                ENTITY_COLORS[
                                                    event.subject.entityType ?? 'other'
                                                ] ?? ENTITY_COLORS.other,
                                        }}
                                    />
                                    <p className="text-xs font-medium truncate">
                                        {event.subject.name ?? 'Unnamed'}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="ml-auto text-[10px] shrink-0"
                                    >
                                        {ENTITY_TYPE_LABELS[event.subject.entityType ?? 'other'] ?? 'Other'}
                                    </Badge>
                                </div>
                            </button>
                        ) : event?.subjectId ? (
                            <button
                                onClick={() =>
                                    event.subjectId &&
                                    onSelectNode(event.subjectId, 'entity')
                                }
                                className="w-full text-left rounded-lg border px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                                <p className="text-xs text-muted-foreground">
                                    Entity {event.subjectId.slice(0, 8)}...
                                </p>
                            </button>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No subject entity.
                            </p>
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
                                                ENTITY_COLORS[
                                                    event.object.entityType ?? 'other'
                                                ] ?? ENTITY_COLORS.other,
                                        }}
                                    />
                                    <p className="text-xs font-medium truncate">
                                        {event.object.name ?? 'Unnamed'}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="ml-auto text-[10px] shrink-0"
                                    >
                                        {ENTITY_TYPE_LABELS[event.object.entityType ?? 'other'] ?? 'Other'}
                                    </Badge>
                                </div>
                            </button>
                        ) : event?.objectId ? (
                            <button
                                onClick={() =>
                                    event.objectId &&
                                    onSelectNode(event.objectId, 'entity')
                                }
                                className="w-full text-left rounded-lg border px-3 py-2.5 hover:bg-muted transition-colors"
                            >
                                <p className="text-xs text-muted-foreground">
                                    Entity {event.objectId.slice(0, 8)}...
                                </p>
                            </button>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No object entity.
                            </p>
                        )}
                    </div>

                    {/* Properties */}
                    {event?.properties &&
                        Object.keys(event.properties).length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        Properties
                                    </h3>
                                    <div className="space-y-1.5">
                                        {Object.entries(event.properties).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-start justify-between gap-2 text-xs"
                                                >
                                                    <span className="text-muted-foreground font-medium">
                                                        {key}
                                                    </span>
                                                    <span className="text-right truncate max-w-[60%]">
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            ),
                                        )}
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
