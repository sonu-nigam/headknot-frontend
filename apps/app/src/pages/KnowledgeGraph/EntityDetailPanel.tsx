import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { X, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { $api } from '@workspace/api-client';
import { useDeleteGraphEntity } from '@/hooks/graph/useDeleteGraphEntity';
import { ENTITY_COLORS, ENTITY_TYPE_LABELS, normalizeEntityType } from './constants';

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

    const { data: entity, isLoading: entityLoading } = $api.useQuery(
        "get", "/entities/{id}",
        { params: { path: { id: entityId } } },
        { enabled: !!entityId },
    );
    const { data: neighbors, isLoading: neighborsLoading } = $api.useQuery(
        "get", "/entities/{id}/neighbors",
        { params: { path: { id: entityId } } },
        { enabled: !!entityId },
    );
    const { data: chunks, isLoading: chunksLoading } = $api.useQuery(
        "get", "/entities/{id}/chunks",
        { params: { path: { id: entityId } } },
        { enabled: !!entityId },
    );

    const deleteMutation = useDeleteGraphEntity();

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        deleteMutation.mutate({ params: { path: { id: entityId } } }, {
            onSuccess: () => onClose(),
        });
    };

    const normalizedType = normalizeEntityType(entity?.entityType);
    const typeColor = ENTITY_COLORS[normalizedType] ?? ENTITY_COLORS.other;
    const typeLabel = ENTITY_TYPE_LABELS[normalizedType] ?? entity?.entityType ?? 'Other';

    // Deduplicate source document IDs from chunks
    const sourceDocIds = chunks
        ? [...new Set(chunks.map((c) => c.documentId).filter(Boolean))]
        : [];

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
                    {/* Entity */}
                    <div>
                        <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: typeColor, color: typeColor }}
                        >
                            {typeLabel}
                        </Badge>
                    </div>

                    {/* Connected Entities */}
                    <Separator />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Connected Entities
                        </h3>
                        {neighborsLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-2">
                                <Loader2 className="size-3 animate-spin" />
                                <span className="text-xs">Loading...</span>
                            </div>
                        ) : neighbors && neighbors.length > 0 ? (
                            <div className="space-y-1.5">
                                {neighbors.map((neighbor, idx) => (
                                    <button
                                        key={neighbor.id ?? idx}
                                        onClick={() =>
                                            neighbor.id &&
                                            onSelectNode(neighbor.id, 'entity')
                                        }
                                        className="w-full text-left rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="size-2 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        ENTITY_COLORS[
                                                            normalizeEntityType(neighbor.entityType)
                                                        ] ?? ENTITY_COLORS.other,
                                                }}
                                            />
                                            <p className="text-xs font-medium truncate">
                                                {neighbor.name ?? 'Unnamed'}
                                            </p>
                                            <Badge variant="outline" className="ml-auto text-[10px] shrink-0">
                                                {ENTITY_TYPE_LABELS[normalizeEntityType(neighbor.entityType)] ?? neighbor.entityType}
                                            </Badge>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No connected entities.
                            </p>
                        )}
                    </div>

                    {/* Source URL */}
                    <Separator />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Source
                        </h3>
                        {chunksLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-2">
                                <Loader2 className="size-3 animate-spin" />
                                <span className="text-xs">Loading...</span>
                            </div>
                        ) : sourceDocIds.length > 0 ? (
                            <div className="space-y-1.5">
                                {sourceDocIds.map((docId) => (
                                    <div
                                        key={docId}
                                        className="flex items-center gap-2 rounded-lg border px-3 py-2"
                                    >
                                        <ExternalLink className="size-3 text-muted-foreground shrink-0" />
                                        <span
                                            className="text-xs font-mono truncate"
                                            title={docId}
                                        >
                                            {docId}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No source documents.
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
