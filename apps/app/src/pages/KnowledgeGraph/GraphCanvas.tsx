import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CosmographRef } from '@cosmograph/react';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { ForceGraph } from './ForceGraph';

export interface GraphCanvasProps {
    nodes: GraphNode[];
    links: GraphLink[];
    selectedNodeId: string | null;
    highlightedPath: string[] | null;
    onNodeClick: (nodeId: string) => void;
    onEdgeClick: (eventId: string) => void;
}

export interface GraphCanvasHandle {
    zoomIn: () => void;
    zoomOut: () => void;
    fitToScreen: () => void;
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(
    function GraphCanvas(props, ref) {
        const cosmoRef = useRef<CosmographRef | null>(null);

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
                className="flex-1 relative overflow-hidden"
                style={{
                    background:
                        'radial-gradient(circle, #222242 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            >
                <ForceGraph ref={cosmoRef} {...props} />
            </div>
        );
    },
);
