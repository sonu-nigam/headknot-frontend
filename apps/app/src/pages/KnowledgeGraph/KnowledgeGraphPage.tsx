import { useRef } from 'react';
import { $api } from '@workspace/api-client';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/state/store';
import { useGraphStore } from '@/state/graphStore';
import { useGraphData } from '@/hooks/graph/useGraphData';
import { GraphCanvas } from './GraphCanvas';
import { GraphToolbar } from './GraphToolbar';
import { EntityDetailPanel } from './EntityDetailPanel';
import { EventDetailPanel } from './EventDetailPanel';
import { PathFinderPanel } from './PathFinderPanel';
import { TemporalFilterPanel } from './TemporalFilterPanel';
import { CreateEntityDialog } from './CreateEntityDialog';
import { CreateEventDialog } from './CreateEventDialog';
import { QAPanel } from './QAPanel';
import { Loader2 } from 'lucide-react';

export { KnowledgeGraphPage };

function KnowledgeGraphPage() {
    const { selectedWorkspaceId } = useAppStore();
    const {
        selectedNodeId,
        selectedNodeType,
        highlightedPath,
        pathFinderOpen,
        temporalFilterOpen,
        createEntityDialogOpen,
        createEventDialogOpen,
        qaPanelOpen,
        entityTypeFilters,
        selectNode,
        clearSelection,
        togglePathFinder,
        toggleTemporalFilter,
        toggleQAPanel,
        setCreateEntityDialogOpen,
        setCreateEventDialogOpen,
    } = useGraphStore();

    const canvasRef = useRef<{
        zoomIn: () => void;
        zoomOut: () => void;
        fitToScreen: () => void;
    } | null>(null);

    // Fetch full graph visualization data in a single request
    const { data: graphData, isLoading } = $api.useQuery(
        "get", "/query/graph",
        { params: { query: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );

    // Transform into d3 nodes/links
    const { nodes, links } = useGraphData(graphData, entityTypeFilters);

    const handleNodeClick = (nodeId: string) => {
        if (!nodeId) {
            clearSelection();
            return;
        }
        selectNode(nodeId, 'entity');
    };

    const handleEdgeClick = (eventId: string) => {
        selectNode(eventId, 'event');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Knowledge Graph' },
            ]}
        >
            <div className="h-[calc(100vh-4rem)] flex overflow-hidden relative">
                {/* Main Graph Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Loading graph data...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <GraphCanvas
                                ref={canvasRef}
                                nodes={nodes}
                                links={links}
                                selectedNodeId={selectedNodeId}
                                highlightedPath={highlightedPath}
                                onNodeClick={handleNodeClick}
                                onEdgeClick={handleEdgeClick}
                            />

                            {/* Bottom Toolbar */}
                            <GraphToolbar
                                onZoomIn={() => canvasRef.current?.zoomIn()}
                                onZoomOut={() => canvasRef.current?.zoomOut()}
                                onFitToScreen={() => canvasRef.current?.fitToScreen()}
                            />

                            {/* Status Bar */}
                            <div className="absolute top-2 left-2 z-10 bg-card/80 backdrop-blur-sm border rounded-lg px-3 py-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                    <strong className="text-foreground">
                                        {graphData?.nodes?.length ?? 0}
                                    </strong>{' '}
                                    entities
                                </span>
                                <span>
                                    <strong className="text-foreground">
                                        {graphData?.edges?.length ?? 0}
                                    </strong>{' '}
                                    events
                                </span>
                                <span>
                                    <strong className="text-foreground">
                                        {links.length}
                                    </strong>{' '}
                                    connections
                                </span>
                                {selectedNodeId && (
                                    <button
                                        onClick={clearSelection}
                                        className="ml-auto text-primary hover:underline"
                                    >
                                        Clear selection
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Detail Panel */}
                {selectedNodeId && selectedNodeType === 'entity' && (
                    <EntityDetailPanel
                        entityId={selectedNodeId}
                        onClose={clearSelection}
                        onSelectNode={(id, type) => selectNode(id, type)}
                    />
                )}
                {selectedNodeId && selectedNodeType === 'event' && (
                    <EventDetailPanel
                        eventId={selectedNodeId}
                        onClose={clearSelection}
                        onSelectNode={(id, type) => selectNode(id, type)}
                    />
                )}

                {/* Floating Panels */}
                {pathFinderOpen && (
                    <PathFinderPanel onClose={togglePathFinder} />
                )}
                {temporalFilterOpen && (
                    <TemporalFilterPanel onClose={toggleTemporalFilter} />
                )}
                {qaPanelOpen && (
                    <QAPanel onClose={toggleQAPanel} />
                )}

                {/* Dialogs */}
                <CreateEntityDialog
                    open={createEntityDialogOpen}
                    onOpenChange={setCreateEntityDialogOpen}
                />
                <CreateEventDialog
                    open={createEventDialogOpen}
                    onOpenChange={setCreateEventDialogOpen}
                />
            </div>
        </AppLayout>
    );
}
