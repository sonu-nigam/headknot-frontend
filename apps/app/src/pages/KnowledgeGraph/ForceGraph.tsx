import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { LINK_COLORS } from './constants';
import { truncateLabel, getNodeColor, isEventNode } from './utils';
import type { Schemas } from '@/types/api';

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

export interface ZoomContext {
    zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown>;
    svgElement: SVGSVGElement;
}

export interface ForceGraphProps {
    nodes: GraphNode[];
    links: GraphLink[];
    selectedNodeId: string | null;
    highlightedPath: string[] | null;
    onNodeClick: (nodeId: string, nodeType: 'entity' | 'event') => void;
    onZoomReady?: (ctx: ZoomContext) => void;
    width: number;
    height: number;
}

const HIGHLIGHT_COLOR = '#f97316';
const ENTITY_RADIUS = 22;
const EVENT_SIZE = 22;
const EVENT_HALF = EVENT_SIZE / 2;

// Helper to get link source/target IDs whether they're strings or SimNode objects
function linkId(
    end: string | number | SimNode,
): string {
    return typeof end === 'object' ? (end as SimNode).id : String(end);
}

export function ForceGraph({
    nodes,
    links,
    selectedNodeId,
    highlightedPath,
    onNodeClick,
    onZoomReady,
    width,
    height,
}: ForceGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
    const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    const onNodeClickRef = useRef(onNodeClick);
    onNodeClickRef.current = onNodeClick;

    // ---- build / rebuild simulation when data changes ----
    useEffect(() => {
        const svg = d3.select(svgRef.current!);
        if (width === 0 || height === 0) return;

        svg.selectAll('*').remove();

        // ---- deep-copy data so d3 can mutate ----
        const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
        const simLinks: SimLink[] = links.map((l) => ({
            source: l.source,
            target: l.target,
            type: l.type,
        }));

        // Build adjacency count per node for tooltip
        const connectionCount = new Map<string, number>();
        for (const l of links) {
            connectionCount.set(l.source, (connectionCount.get(l.source) ?? 0) + 1);
            connectionCount.set(l.target, (connectionCount.get(l.target) ?? 0) + 1);
        }

        // ---- defs: arrow markers ----
        const defs = svg.append('defs');

        // Markers for arrows targeting entity nodes (circles, larger refX)
        const entityRefX = ENTITY_RADIUS + 6;
        // Markers for arrows targeting event nodes (diamonds, smaller refX)
        const eventRefX = Math.ceil(EVENT_HALF * Math.SQRT2) + 4;

        const markerData: { id: string; color: string; refX: number }[] = [
            // SUBJECT_OF: entity→event, arrow arrives at event diamond
            { id: 'arrow-SUBJECT_OF', color: LINK_COLORS.SUBJECT_OF, refX: eventRefX },
            // OBJECT_OF: event→entity, arrow arrives at entity circle
            { id: 'arrow-OBJECT_OF', color: LINK_COLORS.OBJECT_OF, refX: entityRefX },
            { id: 'arrow-highlight-entity', color: HIGHLIGHT_COLOR, refX: entityRefX },
            { id: 'arrow-highlight-event', color: HIGHLIGHT_COLOR, refX: eventRefX },
        ];

        markerData.forEach(({ id, color, refX }) => {
            defs.append('marker')
                .attr('id', id)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', refX)
                .attr('refY', 0)
                .attr('markerWidth', 7)
                .attr('markerHeight', 7)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-4L8,0L0,4')
                .attr('fill', color);
        });

        // ---- zoom container ----
        const zoomContainer = svg.append('g').attr('class', 'zoom-container');

        const zoomBehavior = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                zoomContainer.attr('transform', event.transform.toString());
            });

        svg.call(zoomBehavior);
        zoomBehaviorRef.current = zoomBehavior;

        if (onZoomReady && svgRef.current) {
            onZoomReady({ zoomBehavior, svgElement: svgRef.current });
        }

        // ---- links ----
        const linkGroup = zoomContainer.append('g').attr('class', 'links');

        const linkSelection = linkGroup
            .selectAll<SVGLineElement, SimLink>('line')
            .data(simLinks)
            .join('line')
            .attr('stroke', (d) => LINK_COLORS[d.type] ?? '#555')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.5)
            .attr('stroke-dasharray', (d) =>
                d.type === 'SUBJECT_OF' ? '6 3' : 'none',
            )
            .attr('marker-end', (d) => `url(#arrow-${d.type})`);

        // ---- link labels ----
        const linkLabelGroup = zoomContainer.append('g').attr('class', 'link-labels');

        const linkLabelSelection = linkLabelGroup
            .selectAll<SVGTextElement, SimLink>('text')
            .data(simLinks)
            .join('text')
            .text((d) =>
                d.type === 'SUBJECT_OF' ? 'subject of' : 'object of',
            )
            .attr('text-anchor', 'middle')
            .attr('fill', '#6b7280')
            .attr('font-size', '9px')
            .attr('pointer-events', 'none')
            .attr('dy', -6);

        // ---- node groups ----
        const nodeGroup = zoomContainer.append('g').attr('class', 'nodes');

        const nodeSelection = nodeGroup
            .selectAll<SVGGElement, SimNode>('g')
            .data(simNodes, (d) => d.id)
            .join('g')
            .attr('cursor', 'pointer')
            .on('click', (_event, d) => {
                _event.stopPropagation();
                onNodeClickRef.current(d.id, d.type);
            });

        // ---- Entity nodes: circle ----
        nodeSelection
            .filter((d) => !isEventNode(d as unknown as GraphNode))
            .each(function (d) {
                const g = d3.select(this);
                const color = getNodeColor(d as unknown as GraphNode);

                // Hover ring (hidden by default)
                g.append('circle')
                    .attr('class', 'hover-ring')
                    .attr('r', ENTITY_RADIUS + 5)
                    .attr('fill', 'none')
                    .attr('stroke', color)
                    .attr('stroke-width', 2)
                    .attr('stroke-opacity', 0)
                    .attr('stroke-dasharray', '4 2');

                // Main circle
                g.append('circle')
                    .attr('class', 'node-shape')
                    .attr('r', ENTITY_RADIUS)
                    .attr('fill', color)
                    .attr('stroke', '#1e1e2e')
                    .attr('stroke-width', 2);

                // Tooltip
                g.append('title').text(
                    `${d.label}\nType: ${d.entityType ?? 'unknown'}\nConnections: ${connectionCount.get(d.id) ?? 0}`,
                );
            });

        // ---- Event nodes: diamond ----
        nodeSelection
            .filter((d) => isEventNode(d as unknown as GraphNode))
            .each(function (d) {
                const g = d3.select(this);
                const color = getNodeColor(d as unknown as GraphNode);
                const evtData = d.data as Schemas['GraphEventResponse'];

                // Hover ring (hidden by default)
                g.append('rect')
                    .attr('class', 'hover-ring')
                    .attr('width', EVENT_SIZE + 10)
                    .attr('height', EVENT_SIZE + 10)
                    .attr('x', -(EVENT_SIZE + 10) / 2)
                    .attr('y', -(EVENT_SIZE + 10) / 2)
                    .attr('transform', 'rotate(45)')
                    .attr('fill', 'none')
                    .attr('stroke', color)
                    .attr('stroke-width', 2)
                    .attr('stroke-opacity', 0)
                    .attr('stroke-dasharray', '4 2');

                // Main diamond
                g.append('rect')
                    .attr('class', 'node-shape')
                    .attr('width', EVENT_SIZE)
                    .attr('height', EVENT_SIZE)
                    .attr('x', -EVENT_HALF)
                    .attr('y', -EVENT_HALF)
                    .attr('transform', 'rotate(45)')
                    .attr('fill', color)
                    .attr('stroke', '#1e1e2e')
                    .attr('stroke-width', 2);

                // Small "E" indicator inside diamond
                g.append('text')
                    .text('E')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('fill', '#fff')
                    .attr('font-size', '10px')
                    .attr('font-weight', 'bold')
                    .attr('pointer-events', 'none');

                // Tooltip with subject→object
                const subjectName = evtData.subject?.name ?? evtData.subjectId?.slice(0, 8) ?? '?';
                const objectName = evtData.object?.name ?? evtData.objectId?.slice(0, 8) ?? '?';
                g.append('title').text(
                    `${d.label}\n${subjectName} → ${objectName}`,
                );
            });

        // ---- Labels below nodes ----
        nodeSelection
            .append('text')
            .attr('class', 'node-label')
            .text((d) => truncateLabel(d.label))
            .attr('text-anchor', 'middle')
            .attr('dy', (d) =>
                isEventNode(d as unknown as GraphNode)
                    ? Math.ceil(EVENT_HALF * Math.SQRT2) + 14
                    : ENTITY_RADIUS + 14,
            )
            .attr('fill', '#d1d5db')
            .attr('font-size', '10px')
            .attr('pointer-events', 'none');

        // ---- Hover effects ----
        nodeSelection
            .on('mouseenter', function () {
                d3.select(this)
                    .select('.hover-ring')
                    .transition()
                    .duration(200)
                    .attr('stroke-opacity', 0.6);
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .select('.hover-ring')
                    .transition()
                    .duration(200)
                    .attr('stroke-opacity', 0);
            });

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
                    .distance(140),
            )
            .force('charge', d3.forceManyBody().strength(-350))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide(40));

        simulation.on('tick', () => {
            linkSelection
                .attr('x1', (d) => (d.source as SimNode).x!)
                .attr('y1', (d) => (d.source as SimNode).y!)
                .attr('x2', (d) => (d.target as SimNode).x!)
                .attr('y2', (d) => (d.target as SimNode).y!);

            linkLabelSelection
                .attr('x', (d) => {
                    const s = d.source as SimNode;
                    const t = d.target as SimNode;
                    return (s.x! + t.x!) / 2;
                })
                .attr('y', (d) => {
                    const s = d.source as SimNode;
                    const t = d.target as SimNode;
                    return (s.y! + t.y!) / 2;
                });

            nodeSelection.attr('transform', (d) => `translate(${d.x},${d.y})`);
        });

        simulationRef.current = simulation;

        // Click on empty space clears selection
        svg.on('click', () => {
            onNodeClickRef.current('', 'entity'); // empty id signals clear
        });

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
        const linkLabels = svg.selectAll<SVGTextElement, SimLink>('g.link-labels > text');

        if (highlightedPath && highlightedPath.length > 0) {
            const pathSet = new Set(highlightedPath);

            nodeGroups.each(function (d) {
                const g = d3.select(this);
                const inPath = pathSet.has(d.id);
                g.transition().duration(300).attr('opacity', inPath ? 1 : 0.15);
                g.select('.node-shape')
                    .transition()
                    .duration(300)
                    .attr('stroke', inPath ? HIGHLIGHT_COLOR : '#1e1e2e')
                    .attr('stroke-width', inPath ? 3 : 2);
            });

            linkLines.each(function (d) {
                const line = d3.select(this);
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                const inPath = pathSet.has(srcId) && pathSet.has(tgtId);
                line.transition()
                    .duration(300)
                    .attr('stroke', inPath ? HIGHLIGHT_COLOR : (LINK_COLORS[d.type] ?? '#555'))
                    .attr('stroke-opacity', inPath ? 1 : 0.1)
                    .attr('stroke-width', inPath ? 3 : 2)
                    .attr(
                        'marker-end',
                        inPath
                            ? `url(#arrow-highlight-${d.type === 'SUBJECT_OF' ? 'event' : 'entity'})`
                            : `url(#arrow-${d.type})`,
                    );
            });

            linkLabels.each(function (d) {
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                const inPath = pathSet.has(srcId) && pathSet.has(tgtId);
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('fill', inPath ? HIGHLIGHT_COLOR : '#6b7280')
                    .attr('opacity', inPath ? 1 : 0.1);
            });

            return;
        }

        if (selectedNodeId) {
            const adjacentIds = new Set<string>([selectedNodeId]);
            linkLines.each(function (d) {
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                if (srcId === selectedNodeId) adjacentIds.add(tgtId);
                if (tgtId === selectedNodeId) adjacentIds.add(srcId);
            });

            nodeGroups.each(function (d) {
                const g = d3.select(this);
                const isSelected = d.id === selectedNodeId;
                const isAdjacent = adjacentIds.has(d.id);
                g.transition().duration(300).attr('opacity', isAdjacent ? 1 : 0.15);
                g.select('.node-shape')
                    .transition()
                    .duration(300)
                    .attr('stroke', isSelected ? '#ffffff' : '#1e1e2e')
                    .attr('stroke-width', isSelected ? 3 : 2);
                if (isSelected) {
                    g.raise(); // bring selected to front
                }
            });

            linkLines.each(function (d) {
                const line = d3.select(this);
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                const connected = srcId === selectedNodeId || tgtId === selectedNodeId;
                line.transition()
                    .duration(300)
                    .attr('stroke-opacity', connected ? 0.8 : 0.1)
                    .attr('stroke-width', connected ? 3 : 2);
            });

            linkLabels.each(function (d) {
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                const connected = srcId === selectedNodeId || tgtId === selectedNodeId;
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('opacity', connected ? 1 : 0.1);
            });

            return;
        }

        // No selection — reset
        nodeGroups.transition().duration(300).attr('opacity', 1);
        nodeGroups
            .select('.node-shape')
            .transition()
            .duration(300)
            .attr('stroke', '#1e1e2e')
            .attr('stroke-width', 2);
        linkLines
            .transition()
            .duration(300)
            .attr('stroke', (d: SimLink) => LINK_COLORS[d.type] ?? '#555')
            .attr('stroke-opacity', 0.5)
            .attr('stroke-width', 2)
            .attr('marker-end', (d: SimLink) => `url(#arrow-${d.type})`);
        linkLabels
            .transition()
            .duration(300)
            .attr('fill', '#6b7280')
            .attr('opacity', 1);
    }, [selectedNodeId, highlightedPath, width, height, nodes, links]);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            className="block"
        />
    );
}
