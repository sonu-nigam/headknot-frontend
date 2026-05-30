import {
    forwardRef,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import type { CosmographRef } from '@cosmograph/react';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { ForceGraph } from './ForceGraph';
import { FloatingDetail } from './DetailPanel';

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

        const cosmoRef = useRef<CosmographRef | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);

        // Selected node/edge screen position, reported by ForceGraph. Held here
        // (not in the page) so per-frame tracking updates stay scoped to the canvas.
        const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(
            null,
        );

        // Snapshot the viewport corners (in world space) when a selection begins,
        // and restore them when the panel closes — so closing the details rewinds
        // the graph to whatever the user was looking at before.
        const prevSelectedRef = useRef<string | null>(null);
        const prevViewRef = useRef<number[] | null>(null);

        useLayoutEffect(() => {
            const cosmo = cosmoRef.current;
            const container = containerRef.current;
            if (!cosmo || !container) return;

            const wasSelected = prevSelectedRef.current !== null;
            const isSelected = selectedNodeId !== null;

            if (!wasSelected && isSelected) {
                // Entering a selection session — snapshot the current view.
                // Cosmograph occasionally returns [NaN, NaN] before its camera
                // is initialized, so guard the coords before storing them.
                const cw = container.clientWidth;
                const ch = container.clientHeight;
                const tl = cosmo.screenToSpacePosition?.([0, 0]);
                const br = cosmo.screenToSpacePosition?.([cw, ch]);
                if (
                    tl &&
                    br &&
                    Number.isFinite(tl[0]) &&
                    Number.isFinite(tl[1]) &&
                    Number.isFinite(br[0]) &&
                    Number.isFinite(br[1])
                ) {
                    prevViewRef.current = [tl[0], tl[1], br[0], br[1]];
                }
            } else if (wasSelected && !isSelected && !highlightedPath) {
                // Closing the details — rewind the camera. Skipped when a
                // PathFinder highlight is active (it owns the camera then).
                if (prevViewRef.current) {
                    cosmo.fitViewByCoordinates?.(prevViewRef.current, 600, 0);
                    prevViewRef.current = null;
                }
            }

            prevSelectedRef.current = selectedNodeId;
        }, [selectedNodeId, highlightedPath]);

        useImperativeHandle(
            ref,
            () => ({
                zoomIn() {
                    const cosmo = cosmoRef.current;
                    if (!cosmo) return;
                    const current = cosmo.getZoomLevel?.() ?? 1;
                    cosmo.setZoomLevel?.(current * 1.3, 300);
                },
                zoomOut() {
                    const cosmo = cosmoRef.current;
                    if (!cosmo) return;
                    const current = cosmo.getZoomLevel?.() ?? 1;
                    cosmo.setZoomLevel?.(current / 1.3, 300);
                },
                fitToScreen() {
                    cosmoRef.current?.fitView?.(500, 0.1);
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
                    ref={cosmoRef}
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
