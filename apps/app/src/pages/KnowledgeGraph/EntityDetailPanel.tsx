import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { $api } from '@workspace/api-client';
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

    const normalizedType = normalizeEntityType(entity?.entityType);
    const typeColor = ENTITY_COLORS[normalizedType] ?? ENTITY_COLORS.other;
    const typeLabel = ENTITY_TYPE_LABELS[normalizedType] ?? entity?.entityType ?? 'Other';

    const sources = entity?.sources ?? [];
    const attributes = entity?.attributes ?? {};
    const attributeEntries = Object.entries(attributes);

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

                    {/* Attributes */}
                    {attributeEntries.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    Attributes
                                </h3>
                                <div className="space-y-1">
                                    {attributeEntries.map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-start justify-between gap-2 text-xs"
                                        >
                                            <span className="text-muted-foreground font-medium">
                                                {key}
                                            </span>
                                            <span className="text-right truncate max-w-[60%]">
                                                {typeof value === 'object' && value !== null
                                                    ? JSON.stringify(value)
                                                    : String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

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

                    {/* Sources */}
                    <Separator />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Sources
                        </h3>
                        {sources.length > 0 ? (
                            <div className="space-y-1.5">
                                {sources.map((source, idx) =>
                                    source.sourceUrl ? (
                                        <a
                                            key={source.sourceId ?? idx}
                                            href={source.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
                                        >
                                            <ExternalLink className="size-3 text-primary shrink-0" />
                                            <span
                                                className="text-xs text-primary truncate underline"
                                                title={source.sourceUrl}
                                            >
                                                {source.sourceUrl}
                                            </span>
                                        </a>
                                    ) : (
                                        <div
                                            key={source.sourceId ?? idx}
                                            className="flex items-center gap-2 rounded-lg border px-3 py-2"
                                        >
                                            <ExternalLink className="size-3 text-muted-foreground shrink-0" />
                                            <span className="text-xs font-mono truncate text-muted-foreground" title={source.documentId}>
                                                {source.sourceType ?? source.documentId ?? 'Unknown'}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No sources.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
