import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { X, Loader2, Search, ArrowDown, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/state/store';
import { useGraphStore } from '@/state/graphStore';
import {
    graphEntitiesQueryOptions,
    graphPathQueryOptions,
} from '@/query/options/graph';
import { ENTITY_COLORS, EVENT_NODE_COLOR } from './constants';

interface PathFinderPanelProps {
    onClose: () => void;
}

export function PathFinderPanel({ onClose }: PathFinderPanelProps) {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const setHighlightedPath = useGraphStore((s) => s.setHighlightedPath);

    const [fromId, setFromId] = useState('');
    const [toId, setToId] = useState('');
    const [shouldQuery, setShouldQuery] = useState(false);

    const { data: entities } = useQuery(
        graphEntitiesQueryOptions(selectedWorkspaceId ?? ''),
    );

    const {
        data: pathResult,
        isLoading: pathLoading,
        isError: pathError,
    } = useQuery({
        ...graphPathQueryOptions({ from: fromId, to: toId }),
        enabled: shouldQuery && !!fromId && !!toId,
    });

    const handleFindPath = () => {
        if (fromId && toId) {
            setShouldQuery(true);
        }
    };

    const handleClearPath = () => {
        setShouldQuery(false);
        setHighlightedPath(null);
    };

    // When path data arrives, highlight it
    const firstPath = pathResult?.paths?.[0];
    const pathNodeIds =
        firstPath
            ? [
                  ...(firstPath.nodes?.map((n) => n.id).filter(Boolean) as string[] ?? []),
                  ...(firstPath.edges?.map((e) => e.id).filter(Boolean) as string[] ?? []),
              ]
            : null;

    // Sync highlighted path when results change
    if (shouldQuery && pathNodeIds && pathNodeIds.length > 0) {
        setHighlightedPath(pathNodeIds);
    }

    const entityList = entities ?? [];

    return (
        <div className="absolute top-16 left-16 w-80 bg-card rounded-xl border shadow-xl z-30 flex flex-col max-h-[calc(100%-5rem)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Path Finder</h3>
                <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
                    <X className="size-4" />
                </Button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                {/* From Entity */}
                <div className="space-y-1.5">
                    <Label className="text-xs">From Entity</Label>
                    <select
                        value={fromId}
                        onChange={(e) => {
                            setFromId(e.target.value);
                            setShouldQuery(false);
                        }}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select entity...</option>
                        {entityList.map((entity) => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* To Entity */}
                <div className="space-y-1.5">
                    <Label className="text-xs">To Entity</Label>
                    <select
                        value={toId}
                        onChange={(e) => {
                            setToId(e.target.value);
                            setShouldQuery(false);
                        }}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Select entity...</option>
                        {entityList.map((entity) => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={handleFindPath}
                        disabled={!fromId || !toId || pathLoading}
                    >
                        {pathLoading ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : (
                            <Search className="size-3" />
                        )}
                        Find Path
                    </Button>
                    {shouldQuery && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={handleClearPath}
                        >
                            <RotateCcw className="size-3" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Results */}
                {pathLoading && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}

                {pathError && (
                    <p className="text-xs text-destructive text-center py-2">
                        Failed to find path. Please try again.
                    </p>
                )}

                {shouldQuery && !pathLoading && !pathError && firstPath && (
                    <>
                        <Separator />
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                                Path Found
                            </h4>
                            <div className="space-y-1">
                                {firstPath.nodes?.map((node, idx) => (
                                    <div key={node.id ?? idx}>
                                        {/* Entity node */}
                                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                                            <div
                                                className="size-2.5 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        ENTITY_COLORS[
                                                            node.entityType ?? 'other'
                                                        ] ?? ENTITY_COLORS.other,
                                                }}
                                            />
                                            <span className="text-xs font-medium truncate">
                                                {node.name}
                                            </span>
                                        </div>

                                        {/* Edge between this node and next */}
                                        {firstPath.edges?.[idx] && (
                                            <div className="flex items-center gap-2 py-1 pl-4">
                                                <ArrowDown className="size-3 text-muted-foreground" />
                                                <div className="flex items-center gap-1.5">
                                                    <div
                                                        className="size-2 rounded-sm shrink-0"
                                                        style={{ backgroundColor: EVENT_NODE_COLOR }}
                                                    />
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {firstPath.edges[idx].label}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {shouldQuery &&
                    !pathLoading &&
                    !pathError &&
                    pathResult &&
                    (!pathResult.paths || pathResult.paths.length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-2">
                            No path found between these entities.
                        </p>
                    )}
            </div>
        </div>
    );
}
