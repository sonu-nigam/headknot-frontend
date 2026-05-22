import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import {
    ZoomIn,
    ZoomOut,
    Maximize,
    Route,
    MessageCircleQuestion,
    Trash2,
} from 'lucide-react';
import { useGraphStore } from '@/state/graphStore';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateByPath } from '@/lib/queryKeys';

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
    const toggleQAPanel = useGraphStore((s) => s.toggleQAPanel);
    const qaPanelOpen = useGraphStore((s) => s.qaPanelOpen);
    const pathFinderOpen = useGraphStore((s) => s.pathFinderOpen);
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const queryClient = useQueryClient();

    const clearData = $api.useMutation("delete", "/graph/data", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/entities");
            invalidateByPath(queryClient, "get", "/events");
            invalidateByPath(queryClient, "get", "/query/graph");
        },
    });

    return (
        <div className="absolute top-2 right-2 z-20 flex flex-col items-center gap-1 bg-card border rounded-xl shadow-lg px-1.5 py-2">
            {/* Zoom Controls */}
            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onZoomIn}
                title="Zoom In"
            >
                <ZoomIn className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onZoomOut}
                title="Zoom Out"
            >
                <ZoomOut className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={onFitToScreen}
                title="Fit to Screen"
            >
                <Maximize className="size-4" />
            </Button>

            <Separator orientation="horizontal" className="w-6 my-1" />

            {/* Graph Tools */}
            <Button
                variant={pathFinderOpen ? 'default' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={togglePathFinder}
                title="Path Finder"
            >
                <Route className="size-4" />
            </Button>
            <Button
                variant={qaPanelOpen ? 'default' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={toggleQAPanel}
                title="Q&A"
            >
                <MessageCircleQuestion className="size-4" />
            </Button>

            {import.meta.env.DEV && (
                <>
                    <Separator orientation="horizontal" className="w-6 my-1" />

                    {/* Clear Data (dev only) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
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
                </>
            )}
        </div>
    );
}
