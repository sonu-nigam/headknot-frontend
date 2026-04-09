import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { EVENT_EDGE_COLOR } from './constants';
import { truncateLabel, getNodeColor } from './utils';

/** d3 simulation node — extends GraphNode with mutable x/y/fx/fy. */
interface SimNode extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    type: 'entity';
    entityType?: string;
    data: GraphNode['data'];
}

/** d3 simulation link — source/target become SimNode refs after init. */
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
    eventId: string;
    eventLabel: string;
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
    onNodeClick: (nodeId: string) => void;
    onEdgeClick: (eventId: string) => void;
    onZoomReady?: (ctx: ZoomContext) => void;
    width: number;
    height: number;
}

const HIGHLIGHT_COLOR = '#f97316';
const ENTITY_RADIUS = 22;

function linkId(end: string | number | SimNode): string {
    return typeof end === 'object' ? (end as SimNode).id : String(end);
}

export function ForceGraph({
    nodes,
    links,
    selectedNodeId,
    highlightedPath,
    onNodeClick,
    onEdgeClick,
    onZoomReady,
    width,
    height,
}: ForceGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
    const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    const onNodeClickRef = useRef(onNodeClick);
    onNodeClickRef.current = onNodeClick;
    const onEdgeClickRef = useRef(onEdgeClick);
    onEdgeClickRef.current = onEdgeClick;

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
            eventId: l.eventId,
            eventLabel: l.eventLabel,
        }));

        // Build adjacency count per node
        const connectionCount = new Map<string, number>();
        for (const l of links) {
            connectionCount.set(l.source, (connectionCount.get(l.source) ?? 0) + 1);
            connectionCount.set(l.target, (connectionCount.get(l.target) ?? 0) + 1);
        }

        // ---- defs: arrow markers ----
        const defs = svg.append('defs');
        const arrowRefX = ENTITY_RADIUS + 6;

        const markerData: { id: string; color: string }[] = [
            { id: 'arrow-event', color: EVENT_EDGE_COLOR },
            { id: 'arrow-highlight', color: HIGHLIGHT_COLOR },
        ];

        markerData.forEach(({ id, color }) => {
            defs.append('marker')
                .attr('id', id)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', arrowRefX)
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

        // ---- visible links ----
        const linkGroup = zoomContainer.append('g').attr('class', 'links');

        const linkSelection = linkGroup
            .selectAll<SVGLineElement, SimLink>('line.visible-link')
            .data(simLinks)
            .join('line')
            .attr('class', 'visible-link')
            .attr('stroke', EVENT_EDGE_COLOR)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.5)
            .attr('marker-end', 'url(#arrow-event)');

        // ---- invisible hit-area links (wider, for clicking) ----
        const hitAreaSelection = linkGroup
            .selectAll<SVGLineElement, SimLink>('line.hit-area')
            .data(simLinks)
            .join('line')
            .attr('class', 'hit-area')
            .attr('stroke', 'transparent')
            .attr('stroke-width', 14)
            .attr('cursor', 'pointer')
            .on('click', (_event, d) => {
                _event.stopPropagation();
                onEdgeClickRef.current(d.eventId);
            })
            .on('mouseenter', function (_event, d) {
                // Highlight the corresponding visible link
                linkSelection
                    .filter((ld) => ld.eventId === d.eventId)
                    .transition()
                    .duration(150)
                    .attr('stroke-width', 4)
                    .attr('stroke-opacity', 0.9);
            })
            .on('mouseleave', function (_event, d) {
                linkSelection
                    .filter((ld) => ld.eventId === d.eventId)
                    .transition()
                    .duration(150)
                    .attr('stroke-width', 2)
                    .attr('stroke-opacity', 0.5);
            });

        // ---- link labels (event type) ----
        const linkLabelGroup = zoomContainer.append('g').attr('class', 'link-labels');

        const linkLabelSelection = linkLabelGroup
            .selectAll<SVGTextElement, SimLink>('text')
            .data(simLinks)
            .join('text')
            .text((d) => d.eventLabel.replace(/_/g, ' ').toLowerCase())
            .attr('text-anchor', 'middle')
            .attr('fill', '#9ca3af')
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
                onNodeClickRef.current(d.id);
            });

        // ---- Entity nodes: circle ----
        nodeSelection.each(function (d) {
            const g = d3.select(this);
            const color = getNodeColor(d as unknown as GraphNode);

            // Hover ring
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

        // ---- Labels below nodes ----
        nodeSelection
            .append('text')
            .attr('class', 'node-label')
            .text((d) => truncateLabel(d.label))
            .attr('text-anchor', 'middle')
            .attr('dy', ENTITY_RADIUS + 14)
            .attr('fill', '#d1d5db')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
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
                    .distance(160),
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

            hitAreaSelection
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
            onNodeClickRef.current('');
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
        const visibleLinks = svg.selectAll<SVGLineElement, SimLink>('line.visible-link');
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

            visibleLinks.each(function (d) {
                const line = d3.select(this);
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                const inPath = pathSet.has(srcId) && pathSet.has(tgtId);
                line.transition()
                    .duration(300)
                    .attr('stroke', inPath ? HIGHLIGHT_COLOR : EVENT_EDGE_COLOR)
                    .attr('stroke-opacity', inPath ? 1 : 0.1)
                    .attr('stroke-width', inPath ? 3 : 2)
                    .attr('marker-end', inPath ? 'url(#arrow-highlight)' : 'url(#arrow-event)');
            });

            linkLabels.each(function (d) {
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                const inPath = pathSet.has(srcId) && pathSet.has(tgtId);
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('fill', inPath ? HIGHLIGHT_COLOR : '#9ca3af')
                    .attr('opacity', inPath ? 1 : 0.1);
            });

            return;
        }

        if (selectedNodeId) {
            // Check if the selection is an edge (event)
            const selectedEdge = visibleLinks.data().find((d) => d.eventId === selectedNodeId);

            if (selectedEdge) {
                // Event edge selected — highlight that edge and its endpoints
                const srcId = linkId(selectedEdge.source!);
                const tgtId = linkId(selectedEdge.target!);
                const endpointIds = new Set([srcId, tgtId]);

                nodeGroups.each(function (d) {
                    const g = d3.select(this);
                    const isEndpoint = endpointIds.has(d.id);
                    g.transition().duration(300).attr('opacity', isEndpoint ? 1 : 0.15);
                });

                visibleLinks.each(function (d) {
                    const line = d3.select(this);
                    const isSelected = d.eventId === selectedNodeId;
                    line.transition()
                        .duration(300)
                        .attr('stroke', isSelected ? HIGHLIGHT_COLOR : EVENT_EDGE_COLOR)
                        .attr('stroke-opacity', isSelected ? 1 : 0.1)
                        .attr('stroke-width', isSelected ? 3 : 2)
                        .attr('marker-end', isSelected ? 'url(#arrow-highlight)' : 'url(#arrow-event)');
                });

                linkLabels.each(function (d) {
                    const isSelected = d.eventId === selectedNodeId;
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('fill', isSelected ? HIGHLIGHT_COLOR : '#9ca3af')
                        .attr('opacity', isSelected ? 1 : 0.1);
                });

                return;
            }

            // Entity node selected — highlight adjacent edges and entities
            const adjacentIds = new Set<string>([selectedNodeId]);
            const connectedEventIds = new Set<string>();

            visibleLinks.each(function (d) {
                const srcId = linkId(d.source!);
                const tgtId = linkId(d.target!);
                if (srcId === selectedNodeId) {
                    adjacentIds.add(tgtId);
                    connectedEventIds.add(d.eventId);
                }
                if (tgtId === selectedNodeId) {
                    adjacentIds.add(srcId);
                    connectedEventIds.add(d.eventId);
                }
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
                    g.raise();
                }
            });

            visibleLinks.each(function (d) {
                const line = d3.select(this);
                const connected = connectedEventIds.has(d.eventId);
                line.transition()
                    .duration(300)
                    .attr('stroke-opacity', connected ? 0.8 : 0.1)
                    .attr('stroke-width', connected ? 3 : 2);
            });

            linkLabels.each(function (d) {
                const connected = connectedEventIds.has(d.eventId);
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
        visibleLinks
            .transition()
            .duration(300)
            .attr('stroke', EVENT_EDGE_COLOR)
            .attr('stroke-opacity', 0.5)
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow-event)');
        linkLabels
            .transition()
            .duration(300)
            .attr('fill', '#9ca3af')
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
