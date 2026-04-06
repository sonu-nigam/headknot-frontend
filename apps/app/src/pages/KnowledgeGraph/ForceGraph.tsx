import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { LINK_COLORS } from './constants';
import { truncateLabel, getNodeColor, isEventNode } from './utils';

/** d3 simulation node — extends GraphNode with mutable x/y/fx/fy. */
interface SimNode extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    type: 'entity' | 'event';
    entityType?: string;
    data: GraphNode['data'];
}

/** d3 simulation link — source/target become SimNode refs after init. */
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
    type: 'SUBJECT_OF' | 'OBJECT_OF';
}

export interface ForceGraphProps {
    nodes: GraphNode[];
    links: GraphLink[];
    selectedNodeId: string | null;
    highlightedPath: string[] | null;
    onNodeClick: (nodeId: string, nodeType: 'entity' | 'event') => void;
    width: number;
    height: number;
}

const HIGHLIGHT_COLOR = '#f97316';

export function ForceGraph({
    nodes,
    links,
    selectedNodeId,
    highlightedPath,
    onNodeClick,
    width,
    height,
}: ForceGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
    const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    // Keep a stable ref for the click handler so d3 always sees the latest.
    const onNodeClickRef = useRef(onNodeClick);
    onNodeClickRef.current = onNodeClick;

    // ---- build / rebuild simulation when data changes ----
    useEffect(() => {
        const svg = d3.select(svgRef.current!);
        if (width === 0 || height === 0) return;

        // Clear previous contents
        svg.selectAll('*').remove();

        // ---- deep-copy data so d3 can mutate it ----
        const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
        const simLinks: SimLink[] = links.map((l) => ({
            source: l.source,
            target: l.target,
            type: l.type,
        }));

        // ---- defs: arrow markers ----
        const defs = svg.append('defs');

        const markerData: { id: string; color: string }[] = [
            { id: 'arrow-SUBJECT_OF', color: LINK_COLORS.SUBJECT_OF },
            { id: 'arrow-OBJECT_OF', color: LINK_COLORS.OBJECT_OF },
            { id: 'arrow-highlight', color: HIGHLIGHT_COLOR },
        ];

        markerData.forEach(({ id, color }) => {
            defs.append('marker')
                .attr('id', id)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 28)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', color);
        });

        // ---- zoom container ----
        const zoomContainer = svg
            .append('g')
            .attr('class', 'zoom-container');

        const zoomBehavior = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                zoomContainer.attr('transform', event.transform.toString());
            });

        svg.call(zoomBehavior);
        zoomBehaviorRef.current = zoomBehavior;

        // ---- links ----
        const linkGroup = zoomContainer.append('g').attr('class', 'links');

        const linkSelection = linkGroup
            .selectAll<SVGLineElement, SimLink>('line')
            .data(simLinks)
            .join('line')
            .attr('stroke', (d) => LINK_COLORS[d.type] ?? '#555')
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.6)
            .attr('marker-end', (d) => `url(#arrow-${d.type})`);

        // ---- node groups ----
        const nodeGroup = zoomContainer.append('g').attr('class', 'nodes');

        const nodeSelection = nodeGroup
            .selectAll<SVGGElement, SimNode>('g')
            .data(simNodes, (d) => d.id)
            .join('g')
            .attr('cursor', 'pointer')
            .on('click', (_event, d) => {
                onNodeClickRef.current(d.id, d.type);
            });

        // Entity nodes: circle
        nodeSelection
            .filter((d) => !isEventNode(d as unknown as GraphNode))
            .append('circle')
            .attr('r', 20)
            .attr('fill', (d) => getNodeColor(d as unknown as GraphNode))
            .attr('stroke', '#1e1e2e')
            .attr('stroke-width', 2);

        // Event nodes: diamond (rotated rect)
        nodeSelection
            .filter((d) => isEventNode(d as unknown as GraphNode))
            .append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x', -8)
            .attr('y', -8)
            .attr('transform', 'rotate(45)')
            .attr('fill', (d) => getNodeColor(d as unknown as GraphNode))
            .attr('stroke', '#1e1e2e')
            .attr('stroke-width', 2);

        // Labels
        nodeSelection
            .append('text')
            .text((d) => truncateLabel(d.label))
            .attr('text-anchor', 'middle')
            .attr('dy', 32)
            .attr('fill', '#d1d5db')
            .attr('font-size', '11px')
            .attr('pointer-events', 'none');

        // ---- drag behaviour ----
        const drag = d3
            .drag<SVGGElement, SimNode>()
            .on('start', (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        nodeSelection.call(drag);

        // ---- simulation ----
        const simulation = d3
            .forceSimulation<SimNode>(simNodes)
            .force(
                'link',
                d3
                    .forceLink<SimNode, SimLink>(simLinks)
                    .id((d) => d.id)
                    .distance(120),
            )
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide(35));

        simulation.on('tick', () => {
            linkSelection
                .attr('x1', (d) => (d.source as SimNode).x!)
                .attr('y1', (d) => (d.source as SimNode).y!)
                .attr('x2', (d) => (d.target as SimNode).x!)
                .attr('y2', (d) => (d.target as SimNode).y!);

            nodeSelection.attr('transform', (d) => `translate(${d.x},${d.y})`);
        });

        simulationRef.current = simulation;

        return () => {
            simulation.stop();
        };
    }, [nodes, links, width, height]);

    // ---- highlight / selection updates (no simulation rebuild) ----
    useEffect(() => {
        const svg = d3.select(svgRef.current!);
        if (width === 0 || height === 0) return;

        const nodeGroups = svg.selectAll<SVGGElement, SimNode>('g.nodes > g');
        const linkLines = svg.selectAll<SVGLineElement, SimLink>('g.links > line');

        if (highlightedPath && highlightedPath.length > 0) {
            const pathSet = new Set(highlightedPath);

            nodeGroups.each(function (d) {
                const g = d3.select(this);
                const inPath = pathSet.has(d.id);
                g.attr('opacity', inPath ? 1 : 0.2);
                g.select('circle').attr(
                    'stroke',
                    inPath ? HIGHLIGHT_COLOR : '#1e1e2e',
                );
                g.select('rect').attr(
                    'stroke',
                    inPath ? HIGHLIGHT_COLOR : '#1e1e2e',
                );
            });

            linkLines.each(function (d) {
                const line = d3.select(this);
                const srcId =
                    typeof d.source === 'object'
                        ? (d.source as SimNode).id
                        : (d.source as string);
                const tgtId =
                    typeof d.target === 'object'
                        ? (d.target as SimNode).id
                        : (d.target as string);
                const inPath = pathSet.has(srcId) && pathSet.has(tgtId);
                line.attr('stroke', inPath ? HIGHLIGHT_COLOR : (LINK_COLORS[d.type] ?? '#555'))
                    .attr('stroke-opacity', inPath ? 1 : 0.15)
                    .attr(
                        'marker-end',
                        inPath
                            ? 'url(#arrow-highlight)'
                            : `url(#arrow-${d.type})`,
                    );
            });

            return;
        }

        if (selectedNodeId) {
            // Build adjacency set: selected node + its direct neighbors
            const adjacentIds = new Set<string>([selectedNodeId]);
            linkLines.each(function (d) {
                const srcId =
                    typeof d.source === 'object'
                        ? (d.source as SimNode).id
                        : (d.source as string);
                const tgtId =
                    typeof d.target === 'object'
                        ? (d.target as SimNode).id
                        : (d.target as string);
                if (srcId === selectedNodeId) adjacentIds.add(tgtId);
                if (tgtId === selectedNodeId) adjacentIds.add(srcId);
            });

            nodeGroups.each(function (d) {
                const g = d3.select(this);
                const isSelected = d.id === selectedNodeId;
                const isAdjacent = adjacentIds.has(d.id);
                g.attr('opacity', isAdjacent ? 1 : 0.2);
                g.select('circle')
                    .attr('stroke', isSelected ? '#ffffff' : '#1e1e2e')
                    .attr('stroke-width', isSelected ? 3 : 2)
                    .attr(
                        'transform',
                        isSelected ? 'scale(1.2)' : 'scale(1)',
                    );
                g.select('rect')
                    .attr('stroke', isSelected ? '#ffffff' : '#1e1e2e')
                    .attr('stroke-width', isSelected ? 3 : 2);
            });

            linkLines.each(function (d) {
                const line = d3.select(this);
                const srcId =
                    typeof d.source === 'object'
                        ? (d.source as SimNode).id
                        : (d.source as string);
                const tgtId =
                    typeof d.target === 'object'
                        ? (d.target as SimNode).id
                        : (d.target as string);
                const connected =
                    srcId === selectedNodeId || tgtId === selectedNodeId;
                line.attr('stroke-opacity', connected ? 0.8 : 0.15);
            });

            return;
        }

        // No selection or path — reset everything
        nodeGroups.attr('opacity', 1);
        nodeGroups.select('circle')
            .attr('stroke', '#1e1e2e')
            .attr('stroke-width', 2)
            .attr('transform', 'scale(1)');
        nodeGroups.select('rect')
            .attr('stroke', '#1e1e2e')
            .attr('stroke-width', 2);
        linkLines
            .attr('stroke', (d: SimLink) => LINK_COLORS[d.type] ?? '#555')
            .attr('stroke-opacity', 0.6)
            .attr('marker-end', (d: SimLink) => `url(#arrow-${d.type})`);
    }, [selectedNodeId, highlightedPath, width, height, nodes, links]);

    // Expose zoom behaviour ref so GraphCanvas can use it
    const getZoomBehavior = useCallback(
        () => ({
            zoomBehavior: zoomBehaviorRef.current,
            svgElement: svgRef.current,
        }),
        [],
    );

    // Attach getter to the SVG ref for parent access
    useEffect(() => {
        const el = svgRef.current;
        if (el) {
            (el as any).__zoomAccessor = getZoomBehavior;
        }
    }, [getZoomBehavior]);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            className="block"
        />
    );
}
