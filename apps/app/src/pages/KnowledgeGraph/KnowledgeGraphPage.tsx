import { useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/state/store';
import { useGraphStore } from '@/state/graphStore';
import { useGraphData } from '@/hooks/graph/useGraphData';
import {
    graphEntitiesQueryOptions,
    graphEventsQueryOptions,
    graphEventDetailsQueryOptions,
} from '@/query/options/graph';
import { GraphCanvas } from './GraphCanvas';
import { GraphToolbar } from './GraphToolbar';
import { EntityDetailPanel } from './EntityDetailPanel';
import { EventDetailPanel } from './EventDetailPanel';
import { PathFinderPanel } from './PathFinderPanel';
import { TemporalFilterPanel } from './TemporalFilterPanel';
import { CreateEntityDialog } from './CreateEntityDialog';
import { CreateEventDialog } from './CreateEventDialog';
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
        entityTypeFilters,
        selectNode,
        clearSelection,
        togglePathFinder,
        toggleTemporalFilter,
        setCreateEntityDialogOpen,
        setCreateEventDialogOpen,
    } = useGraphStore();

    const canvasRef = useRef<{
        zoomIn: () => void;
        zoomOut: () => void;
        fitToScreen: () => void;
    } | null>(null);

    // 1. Fetch all entities
    const { data: entities, isLoading: entitiesLoading } = useQuery({
        ...graphEntitiesQueryOptions(selectedWorkspaceId ?? ''),
        enabled: !!selectedWorkspaceId,
    });

    // 2. Fetch event list (no subject/object, just IDs)
    const { data: eventList, isLoading: eventsLoading } = useQuery({
        ...graphEventsQueryOptions(selectedWorkspaceId ?? ''),
        enabled: !!selectedWorkspaceId,
    });

    // 3. Extract event IDs and fetch details (which include subject/object)
    const eventIds = useMemo(
        () =>
            (eventList ?? [])
                .map((e) => e.id)
                .filter((id): id is string => !!id),
        [eventList],
    );

    const { data: eventDetails, isLoading: detailsLoading } = useQuery({
        ...graphEventDetailsQueryOptions(eventIds),
        enabled: eventIds.length > 0,
    });

    // 4. Transform into d3 nodes/links
    const { nodes, links } = useGraphData(
        entities,
        eventDetails,
        entityTypeFilters,
    );

    const isLoading = entitiesLoading || eventsLoading || detailsLoading;

    const handleNodeClick = (nodeId: string, nodeType: 'entity' | 'event') => {
        if (!nodeId) {
            clearSelection();
            return;
        }
        selectNode(nodeId, nodeType);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Knowledge Graph' },
            ]}
        >
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Toolbar */}
                <GraphToolbar
                    onZoomIn={() => canvasRef.current?.zoomIn()}
                    onZoomOut={() => canvasRef.current?.zoomOut()}
                    onFitToScreen={() => canvasRef.current?.fitToScreen()}
                />

                {/* Main Graph Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
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
                            />

                            {/* Status Bar */}
                            <div className="h-8 bg-card border-t flex items-center px-4 gap-4 text-xs text-muted-foreground shrink-0">
                                <span>
                                    <strong className="text-foreground">
                                        {entities?.length ?? 0}
                                    </strong>{' '}
                                    entities
                                </span>
                                <span>
                                    <strong className="text-foreground">
                                        {eventDetails?.length ?? 0}
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
                        onSelectNode={handleNodeClick}
                    />
                )}
                {selectedNodeId && selectedNodeType === 'event' && (
                    <EventDetailPanel
                        eventId={selectedNodeId}
                        onClose={clearSelection}
                        onSelectNode={handleNodeClick}
                    />
                )}

                {/* Floating Panels */}
                {pathFinderOpen && (
                    <PathFinderPanel onClose={togglePathFinder} />
                )}
                {temporalFilterOpen && (
                    <TemporalFilterPanel onClose={toggleTemporalFilter} />
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
