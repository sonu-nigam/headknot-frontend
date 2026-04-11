import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import {
    ZoomIn,
    ZoomOut,
    Maximize,
    Route,
    Clock,
    PlusCircle,
    Link,
    Trash2,
} from 'lucide-react';
import { useGraphStore } from '@/state/graphStore';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateByPath } from '@/lib/queryKeys';
import { ENTITY_COLORS, EVENT_EDGE_COLOR, ENTITY_TYPE_LABELS } from './constants';

interface GraphToolbarProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitToScreen: () => void;
}

export function GraphToolbar({
    onZoomIn,
    onZoomOut,
    onFitToScreen,
}: GraphToolbarProps) {
    const togglePathFinder = useGraphStore((s) => s.togglePathFinder);
    const toggleTemporalFilter = useGraphStore((s) => s.toggleTemporalFilter);
    const setCreateEntityDialogOpen = useGraphStore(
        (s) => s.setCreateEntityDialogOpen,
    );
    const setCreateEventDialogOpen = useGraphStore(
        (s) => s.setCreateEventDialogOpen,
    );
    const pathFinderOpen = useGraphStore((s) => s.pathFinderOpen);
    const temporalFilterOpen = useGraphStore((s) => s.temporalFilterOpen);
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const queryClient = useQueryClient();

    const clearData = $api.useMutation("delete", "/graph/data", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/graph");
        },
    });

    return (
        <div className="w-12 bg-card border-r flex flex-col items-center py-4 gap-2">
            {/* Zoom Controls */}
            <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={onZoomIn}
                title="Zoom In"
            >
                <ZoomIn className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={onZoomOut}
                title="Zoom Out"
            >
                <ZoomOut className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={onFitToScreen}
                title="Fit to Screen"
            >
                <Maximize className="size-4" />
            </Button>

            <Separator className="w-6" />

            {/* Graph Tools */}
            <Button
                variant={pathFinderOpen ? 'default' : 'ghost'}
                size="icon"
                className="size-9"
                onClick={togglePathFinder}
                title="Path Finder"
            >
                <Route className="size-4" />
            </Button>
            <Button
                variant={temporalFilterOpen ? 'default' : 'ghost'}
                size="icon"
                className="size-9"
                onClick={toggleTemporalFilter}
                title="Temporal Filter"
            >
                <Clock className="size-4" />
            </Button>

            <Separator className="w-6" />

            {/* Create Actions */}
            <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => setCreateEntityDialogOpen(true)}
                title="Create Entity"
            >
                <PlusCircle className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => setCreateEventDialogOpen(true)}
                title="Create Event"
            >
                <Link className="size-4" />
            </Button>

            <Separator className="w-6" />

            {/* Clear Data (testing) */}
            <Button
                variant="ghost"
                size="icon"
                className="size-9 text-destructive hover:text-destructive"
                onClick={() => {
                    if (!selectedWorkspaceId) return;
                    if (!confirm('Clear all graph data for this workspace?')) return;
                    clearData.mutate({
                        params: { query: { workspaceId: selectedWorkspaceId } },
                    });
                }}
                disabled={clearData.isPending || !selectedWorkspaceId}
                title="Clear All Graph Data"
            >
                <Trash2 className="size-4" />
            </Button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Legend */}
            <div className="space-y-1.5 px-1">
                {Object.entries(ENTITY_COLORS).map(([type, color]) => (
                    <div
                        key={type}
                        className="flex items-center gap-1.5"
                        title={ENTITY_TYPE_LABELS[type] ?? type}
                    >
                        <div
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                        />
                    </div>
                ))}
                <div
                    className="flex items-center gap-1.5"
                    title="Event (edge)"
                >
                    <div
                        className="w-4 h-0.5 shrink-0"
                        style={{ backgroundColor: EVENT_EDGE_COLOR }}
                    />
                </div>
            </div>
        </div>
    );
}
