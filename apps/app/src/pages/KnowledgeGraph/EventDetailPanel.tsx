import { useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { $api } from '@workspace/api-client';
import {
    ENTITY_COLORS,
    ENTITY_TYPE_LABELS,
    normalizeEntityType,
} from './constants';
import type { Schemas } from '@/types/api';

interface EventDetailPanelProps {
    eventId: string;
    allEdges: Schemas['Edge'][];
    allNodes: Schemas['Node'][];
    onClose: () => void;
    onSelectNode: (id: string, type: 'entity' | 'event') => void;
}

/**
 * Panel for an entity-pair's relationships. When the user clicks a single edge in the graph,
 * we resolve that edge's (subject, object) pair and surface every relationship between that
 * same pair — clicked edge first, then siblings. Each row expands to show description,
 * confidence, and temporal fields.
 */
export function EventDetailPanel({
    eventId,
    allEdges,
    allNodes,
    onClose,
    onSelectNode,
}: EventDetailPanelProps) {
    // Hydrate the clicked event for subject/object resolution.
    const { data: clickedEvent, isLoading } = $api.useQuery(
        'get',
        '/events/{id}',
        { params: { path: { id: eventId } } },
        { enabled: !!eventId },
    );

    const subjectId = clickedEvent?.subject?.id;
    const objectId = clickedEvent?.object?.id;

    // All edges in either direction between this pair, with the clicked edge ordered first.
    const pairRelationships = useMemo(() => {
        if (!subjectId || !objectId) return [] as Schemas['Edge'][];
        const matches = allEdges.filter(
            (e) =>
                (e.source === subjectId && e.target === objectId) ||
                (e.source === objectId && e.target === subjectId),
        );
        const clicked = matches.find((e) => e.id === eventId);
        const rest = matches.filter((e) => e.id !== eventId);
        return clicked ? [clicked, ...rest] : matches;
    }, [allEdges, subjectId, objectId, eventId]);

    const subjectNode = useMemo(
        () => allNodes.find((n) => n.id === subjectId),
        [allNodes, subjectId],
    );
    const objectNode = useMemo(
        () => allNodes.find((n) => n.id === objectId),
        [allNodes, objectId],
    );

    return (
        <div className="absolute right-0 top-0 w-80 bg-card border-l h-full overflow-y-auto z-20 flex flex-col">
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
                                {subjectNode?.name ?? 'A'}{' '}
                                <span className="text-muted-foreground">↔</span>{' '}
                                {objectNode?.name ?? 'B'}
                            </h2>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {pairRelationships.length} relationship
                                {pairRelationships.length === 1 ? '' : 's'}{' '}
                                between these entities
                            </p>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={onClose}
                >
                    <X className="size-4" />
                </Button>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex-1 p-4 space-y-4">
                    {/* Endpoints */}
                    <div className="grid grid-cols-2 gap-2">
                        <EndpointCard
                            label="Subject"
                            node={subjectNode}
                            onSelect={() =>
                                subjectId && onSelectNode(subjectId, 'entity')
                            }
                        />
                        <EndpointCard
                            label="Object"
                            node={objectNode}
                            onSelect={() =>
                                objectId && onSelectNode(objectId, 'entity')
                            }
                        />
                    </div>

                    <Separator />

                    {/* Relationships list */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Relationships
                        </h3>
                        {pairRelationships.map((edge, idx) => (
                            <RelationshipRow
                                key={edge.id}
                                edge={edge}
                                defaultOpen={idx === 0}
                                isClicked={edge.id === eventId}
                            />
                        ))}
                        {pairRelationships.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                No relationships found for this pair.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function EndpointCard({
    label,
    node,
    onSelect,
}: {
    label: string;
    node: Schemas['Node'] | undefined;
    onSelect: () => void;
}) {
    if (!node) {
        return (
            <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">
                {label}: —
            </div>
        );
    }
    const type = normalizeEntityType(node.entityType);
    return (
        <button
            onClick={onSelect}
            className="text-left rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
        >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                {label}
            </p>
            <div className="flex items-center gap-2">
                <div
                    className="size-2 rounded-full shrink-0"
                    style={{
                        backgroundColor:
                            ENTITY_COLORS[type] ?? ENTITY_COLORS.other,
                    }}
                />
                <p className="text-xs font-medium truncate">
                    {node.name ?? 'Unnamed'}
                </p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
                {ENTITY_TYPE_LABELS[type] ?? node.entityType}
            </p>
        </button>
    );
}

function RelationshipRow({
    edge,
    defaultOpen,
    isClicked,
}: {
    edge: Schemas['Edge'];
    defaultOpen: boolean;
    isClicked: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <button
                    className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 hover:bg-muted transition-colors text-left ${
                        isClicked ? 'border-primary/60 bg-primary/5' : ''
                    }`}
                >
                    <span className="text-xs font-medium truncate">
                        {edge.relationship ?? 'Relationship'}
                    </span>
                    <ChevronDown
                        className={`size-3 shrink-0 transition-transform ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1.5 px-3 py-2">
                {edge.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {edge.description}
                    </p>
                )}
                {edge.confidence !== undefined && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                            Confidence
                        </span>
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                    width: `${Math.round((edge.confidence ?? 0) * 100)}%`,
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-mono">
                            {Math.round((edge.confidence ?? 0) * 100)}%
                        </span>
                    </div>
                )}
                <Badge variant="outline" className="text-[10px]">
                    {edge.source === edge.target ? 'self' : 'directed'}
                </Badge>
            </CollapsibleContent>
        </Collapsible>
    );
}

