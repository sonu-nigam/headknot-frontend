import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { X, Loader2, Trash2, ArrowRight } from 'lucide-react';
import {
    graphEntityByIdQueryOptions,
    graphEntityEventsQueryOptions,
    graphEntityNeighborsQueryOptions,
} from '@/query/options/graph';
import { useDeleteGraphEntity } from '@/hooks/graph/useDeleteGraphEntity';
import { ENTITY_COLORS, ENTITY_TYPE_LABELS } from './constants';

interface EntityDetailPanelProps {
    entityId: string;
    onClose: () => void;
    onSelectNode: (id: string, type: 'entity' | 'event') => void;
}

export function EntityDetailPanel({
    entityId,
    onClose,
    onSelectNode,
}: EntityDetailPanelProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { data: entity, isLoading: entityLoading } = useQuery(
        graphEntityByIdQueryOptions(entityId),
    );
    const { data: events, isLoading: eventsLoading } = useQuery(
        graphEntityEventsQueryOptions(entityId),
    );
    const { data: neighbors, isLoading: neighborsLoading } = useQuery(
        graphEntityNeighborsQueryOptions(entityId),
    );

    const deleteMutation = useDeleteGraphEntity();

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        deleteMutation.mutate(entityId, {
            onSuccess: () => onClose(),
        });
    };

    const typeColor = ENTITY_COLORS[entity?.entityType ?? 'other'] ?? ENTITY_COLORS.other;
    const typeLabel = ENTITY_TYPE_LABELS[entity?.entityType ?? 'other'] ?? 'Other';

    return (
        <div className="absolute right-0 top-0 w-80 bg-card border-l h-full overflow-y-auto z-20 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="min-w-0 flex-1">
                    {entityLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            <span className="text-sm">Loading...</span>
                        </div>
                    ) : (
                        <h2 className="text-sm font-semibold truncate">
                            {entity?.name ?? 'Unnamed Entity'}
                        </h2>
                    )}
                </div>
                <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            {entityLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex-1 p-4 space-y-5">
                    {/* Type Badge */}
                    <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: typeColor, color: typeColor }}
                    >
                        {typeLabel}
                    </Badge>

                    {/* Properties */}
                    {entity?.properties &&
                        Object.keys(entity.properties).length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                        Properties
                                    </h3>
                                    <div className="space-y-1.5">
                                        {Object.entries(entity.properties).map(
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

                    {/* Events */}
                    <Separator />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Events
                        </h3>
                        {eventsLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-2">
                                <Loader2 className="size-3 animate-spin" />
                                <span className="text-xs">Loading events...</span>
                            </div>
                        ) : events && events.length > 0 ? (
                            <div className="space-y-1.5">
                                {events.map((event) => (
                                    <button
                                        key={event.id}
                                        onClick={() =>
                                            event.id && onSelectNode(event.id, 'event')
                                        }
                                        className="w-full text-left rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
                                    >
                                        <p className="text-xs font-medium truncate">
                                            {event.label ?? 'Untitled Event'}
                                        </p>
                                        {event.occurredAt && (
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {new Date(event.occurredAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No events found.
                            </p>
                        )}
                    </div>

                    {/* Neighbors */}
                    <Separator />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Neighbors
                        </h3>
                        {neighborsLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-2">
                                <Loader2 className="size-3 animate-spin" />
                                <span className="text-xs">Loading neighbors...</span>
                            </div>
                        ) : neighbors && neighbors.length > 0 ? (
                            <div className="space-y-1.5">
                                {neighbors.map((neighbor, idx) => (
                                    <button
                                        key={neighbor.entity?.id ?? idx}
                                        onClick={() =>
                                            neighbor.entity?.id &&
                                            onSelectNode(neighbor.entity.id, 'entity')
                                        }
                                        className="w-full text-left rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="size-2 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        ENTITY_COLORS[
                                                            neighbor.entity?.entityType ?? 'other'
                                                        ] ?? ENTITY_COLORS.other,
                                                }}
                                            />
                                            <p className="text-xs font-medium truncate">
                                                {neighbor.entity?.name ?? 'Unnamed'}
                                            </p>
                                        </div>
                                        {neighbor.relationship && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <ArrowRight className="size-2.5 text-muted-foreground" />
                                                <span className="text-[10px] text-muted-foreground">
                                                    {neighbor.relationship}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No neighbors found.
                            </p>
                        )}
                    </div>
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
                    {confirmDelete ? 'Confirm Delete' : 'Delete Entity'}
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
