import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { ForceGraph, ZoomContext } from './ForceGraph';

export interface GraphCanvasProps {
    nodes: GraphNode[];
    links: GraphLink[];
    selectedNodeId: string | null;
    highlightedPath: string[] | null;
    onNodeClick: (nodeId: string, nodeType: 'entity' | 'event') => void;
}

export interface GraphCanvasHandle {
    zoomIn: () => void;
    zoomOut: () => void;
    fitToScreen: () => void;
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(
    function GraphCanvas(
        { nodes, links, selectedNodeId, highlightedPath, onNodeClick },
        ref,
    ) {
        const containerRef = useRef<HTMLDivElement>(null);
        const zoomCtxRef = useRef<ZoomContext | null>(null);
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;

            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    setDimensions({ width: Math.floor(width), height: Math.floor(height) });
                }
            });

            observer.observe(el);
            return () => observer.disconnect();
        }, []);

        const handleZoomReady = useCallback((ctx: ZoomContext) => {
            zoomCtxRef.current = ctx;
        }, []);

        useImperativeHandle(ref, () => ({
            zoomIn() {
                const ctx = zoomCtxRef.current;
                if (!ctx) return;
                const svg = d3.select<SVGSVGElement, unknown>(ctx.svgElement);
                ctx.zoomBehavior.scaleBy(svg.transition().duration(300), 1.3);
            },
            zoomOut() {
                const ctx = zoomCtxRef.current;
                if (!ctx) return;
                const svg = d3.select<SVGSVGElement, unknown>(ctx.svgElement);
                ctx.zoomBehavior.scaleBy(svg.transition().duration(300), 1 / 1.3);
            },
            fitToScreen() {
                const ctx = zoomCtxRef.current;
                if (!ctx) return;
                const svg = d3.select<SVGSVGElement, unknown>(ctx.svgElement);
                const { width, height } = dimensions;
                svg.transition()
                    .duration(500)
                    .call(
                        ctx.zoomBehavior.transform,
                        d3.zoomIdentity
                            .translate(width / 2, height / 2)
                            .scale(1)
                            .translate(-width / 2, -height / 2),
                    );
            },
        }));

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
                {dimensions.width > 0 && dimensions.height > 0 && (
                    <ForceGraph
                        nodes={nodes}
                        links={links}
                        selectedNodeId={selectedNodeId}
                        highlightedPath={highlightedPath}
                        onNodeClick={onNodeClick}
                        onZoomReady={handleZoomReady}
                        width={dimensions.width}
                        height={dimensions.height}
                    />
                )}
            </div>
        );
    },
);
