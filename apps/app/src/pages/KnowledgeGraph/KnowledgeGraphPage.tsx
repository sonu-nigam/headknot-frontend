import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/state/store';
import { useGraphStore } from '@/state/graphStore';
import { useGraphData } from '@/hooks/graph/useGraphData';
import {
    graphEntitiesQueryOptions,
    graphEventsQueryOptions,
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

    const { data: entities, isLoading: entitiesLoading } = useQuery({
        ...graphEntitiesQueryOptions(selectedWorkspaceId ?? ''),
        enabled: !!selectedWorkspaceId,
    });

    const { data: events, isLoading: eventsLoading } = useQuery({
        ...graphEventsQueryOptions(selectedWorkspaceId ?? ''),
        enabled: !!selectedWorkspaceId,
    });

    const { nodes, links } = useGraphData(entities, events, entityTypeFilters);

    const isLoading = entitiesLoading || eventsLoading;

    const handleNodeClick = (nodeId: string, nodeType: 'entity' | 'event') => {
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
                                        {
                                            nodes.filter(
                                                (n) => n.type === 'entity',
                                            ).length
                                        }
                                    </strong>{' '}
                                    entities
                                </span>
                                <span>
                                    <strong className="text-foreground">
                                        {
                                            nodes.filter(
                                                (n) => n.type === 'event',
                                            ).length
                                        }
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
