import {
    forwardRef,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { ForceGraph, type ForceGraphHandle } from './ForceGraph';
import { FloatingDetail } from './DetailPanel';

type ViewState = { position: { x: number; y: number }; scale: number };

export interface GraphCanvasProps {
    nodes: GraphNode[];
    links: GraphLink[];
    selectedNodeId: string | null;
    highlightedPath: string[] | null;
    onNodeClick: (nodeId: string) => void;
    onEdgeClick: (eventId: string) => void;
    /** Detail card to float beside the selected node/edge. */
    detailPanel?: ReactNode;
}

export interface GraphCanvasHandle {
    zoomIn: () => void;
    zoomOut: () => void;
    fitToScreen: () => void;
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(
    function GraphCanvas(props, ref) {
        const { detailPanel, selectedNodeId, highlightedPath, ...rest } = props;

        const fgRef = useRef<ForceGraphHandle | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);

        // Selected node/edge screen position, reported by ForceGraph. Held here
        // (not in the page) so per-frame tracking updates stay scoped to the canvas.
        const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(
            null,
        );

        // Snapshot the viewport (camera position + zoom) when a selection begins,
        // and restore it when the panel closes — so closing the details rewinds
        // the graph to whatever the user was looking at before.
        const prevSelectedRef = useRef<string | null>(null);
        const prevViewRef = useRef<ViewState | null>(null);

        useLayoutEffect(() => {
            const fg = fgRef.current;
            if (!fg) return;

            const wasSelected = prevSelectedRef.current !== null;
            const isSelected = selectedNodeId !== null;

            if (!wasSelected && isSelected) {
                // Entering a selection session — snapshot the current view.
                const v = fg.getViewState();
                if (v) prevViewRef.current = v;
            } else if (wasSelected && !isSelected && !highlightedPath) {
                // Closing the details — rewind the camera. Skipped when a
                // PathFinder highlight is active (it owns the camera then).
                if (prevViewRef.current) {
                    fg.setViewState(prevViewRef.current, 600);
                    prevViewRef.current = null;
                }
            }

            prevSelectedRef.current = selectedNodeId;
        }, [selectedNodeId, highlightedPath]);

        useImperativeHandle(
            ref,
            () => ({
                zoomIn() {
                    fgRef.current?.zoomBy(1.3);
                },
                zoomOut() {
                    fgRef.current?.zoomBy(1 / 1.3);
                },
                fitToScreen() {
                    fgRef.current?.fit();
                },
            }),
            [],
        );

        return (
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden"
                style={{
                    background:
                        'radial-gradient(circle, #222242 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            >
                <ForceGraph
                    ref={fgRef}
                    {...rest}
                    selectedNodeId={selectedNodeId}
                    highlightedPath={highlightedPath}
                    onAnchorChange={setAnchor}
                />
                {detailPanel && (
                    <FloatingDetail anchor={anchor}>{detailPanel}</FloatingDetail>
                )}
            </div>
        );
    },
);
