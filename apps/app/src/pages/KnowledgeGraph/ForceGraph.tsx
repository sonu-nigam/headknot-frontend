import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cosmograph, type CosmographRef } from '@cosmograph/react';
import type { GraphNode, GraphLink } from '@/hooks/graph/useGraphData';
import { useAppStore } from '@/state/store';
import {
    loadGraphLayout,
    saveGraphLayout,
    type SavedPositions,
} from '@/lib/graphLayout';
import { EVENT_EDGE_COLOR } from './constants';
import { getNodeColor } from './utils';

export interface ForceGraphProps {
    nodes: GraphNode[];
    links: GraphLink[];
    selectedNodeId: string | null;
    highlightedPath: string[] | null;
    onNodeClick: (nodeId: string) => void;
    onEdgeClick: (eventId: string) => void;
}

interface CosmoPoint {
    id: string;
    index: number;
    label: string;
    color: string;
    entityType: string;
    x?: number;
    y?: number;
}

interface CosmoLink {
    source: string;
    target: string;
    sourceIndex: number;
    targetIndex: number;
    eventId: string;
}

interface EdgeMeta {
    sourceIndex: number;
    targetIndex: number;
    eventId: string;
    label: string;
}

interface EdgeLabel {
    eventId: string;
    label: string;
    x: number;
    y: number;
}

/** Don't render more than this many edge labels at once — DOM cost gets nasty. */
const MAX_EDGE_LABELS = 120;
/** Hide edge labels when zoomed out further than this. */
const EDGE_LABEL_MIN_ZOOM = 0.6;

interface HoverState {
    x: number;
    y: number;
    label: string;
    sub?: string;
}

export const ForceGraph = forwardRef<CosmographRef, ForceGraphProps>(
    function ForceGraph(
        {
            nodes,
            links,
            selectedNodeId,
            highlightedPath,
            onNodeClick,
            onEdgeClick,
        },
        ref,
    ) {
        const [hover, setHover] = useState<HoverState | null>(null);

        // Saved layout for this workspace — seeds initial node positions so the
        // graph reopens in the same arrangement instead of a fresh random one.
        const workspaceId = useAppStore((s) => s.selectedWorkspaceId) ?? '';
        const savedPositions = useMemo(
            () => loadGraphLayout(workspaceId),
            [workspaceId],
        );
        const hasSavedLayout = Object.keys(savedPositions).length > 0;

        const { points, edges, edgeMeta, idToIndex, edgeIdToEventId } =
            useMemo(() => {
                // Centroid of saved positions — new (unsaved) entities start here
                // with a small jitter so the simulation pulls them into the
                // existing cluster rather than dropping them at the origin.
                let cx = 0;
                let cy = 0;
                const savedEntries = Object.values(savedPositions);
                for (const [x, y] of savedEntries) {
                    cx += x;
                    cy += y;
                }
                if (savedEntries.length > 0) {
                    cx /= savedEntries.length;
                    cy /= savedEntries.length;
                }

                const idx = new Map<string, number>();
                const points: CosmoPoint[] = nodes.map((n, i) => {
                    idx.set(n.id, i);
                    const saved = savedPositions[n.id];
                    return {
                        id: n.id,
                        index: i,
                        label: n.label || 'Unknown',
                        color: getNodeColor(n),
                        // Arrow infers schema from the first row — always a string
                        // so the column type isn't mixed string|null.
                        entityType: n.entityType ?? '',
                        x: saved ? saved[0] : cx + (Math.random() - 0.5) * 20,
                        y: saved ? saved[1] : cy + (Math.random() - 0.5) * 20,
                    };
                });
                const edges: CosmoLink[] = [];
                const edgeMeta: EdgeMeta[] = [];
                const edgeIdToEventId: string[] = [];
                for (const l of links) {
                    const si = idx.get(l.source);
                    const ti = idx.get(l.target);
                    if (si === undefined || ti === undefined) continue;
                    edges.push({
                        source: l.source,
                        target: l.target,
                        sourceIndex: si,
                        targetIndex: ti,
                        eventId: l.eventId,
                    });
                    edgeMeta.push({
                        sourceIndex: si,
                        targetIndex: ti,
                        eventId: l.eventId,
                        label: (l.eventLabel ?? '')
                            .replace(/_/g, ' ')
                            .toLowerCase(),
                    });
                    edgeIdToEventId.push(l.eventId);
                }
                return { points, edges, edgeMeta, idToIndex: idx, edgeIdToEventId };
            }, [nodes, links, savedPositions]);

        // ---- reflect external selection state into Cosmograph ----
        //
        // Cosmograph dims non-selected points via pointGreyoutOpacity, which
        // is exactly the "selection focus" UX we want. We drive it from the
        // store rather than relying on selectPointOnClick, so other UIs
        // (AskBox, PathFinder) can change selection programmatically.
        const cosmoRef = useRef<CosmographRef | null>(null);
        const setRefs = useCallback(
            (instance: CosmographRef) => {
                cosmoRef.current = instance;
                if (typeof ref === 'function') ref(instance);
                else if (ref) ref.current = instance;
            },
            [ref],
        );

        useEffect(() => {
            const cosmo = cosmoRef.current;
            if (!cosmo) return;

            // 1) Path highlight takes precedence — highlight the path nodes
            //    and pan/zoom the camera so they're all in view (used by both
            //    PathFinder and AskBox to spotlight relevant entities).
            if (highlightedPath && highlightedPath.length > 0) {
                const indices: number[] = [];
                for (const id of highlightedPath) {
                    const i = idToIndex.get(id);
                    if (i !== undefined) indices.push(i);
                }
                if (indices.length > 0) {
                    cosmo.selectPoints(indices);
                    cosmo.setFocusedPoint(indices[0]);
                    cosmo.fitViewByIndices?.(indices, 600, 0.2);
                }
                return;
            }

            // 2) Selection is empty → clear focus/selection.
            if (!selectedNodeId) {
                cosmo.unselectAllPoints?.();
                cosmo.selectPoints(null);
                cosmo.setFocusedPoint(undefined);
                return;
            }

            // 3) Selected id matches a point → select + focus it (with neighbors).
            const pointIdx = idToIndex.get(selectedNodeId);
            if (pointIdx !== undefined) {
                // Select this point and its connected neighbors so the cluster
                // stays bright while everything else dims.
                cosmo.selectPoint(pointIdx, false, true);
                cosmo.setFocusedPoint(pointIdx);
                return;
            }

            // 4) Selected id refers to an edge (eventId) → highlight endpoints.
            const edgeIdx = edgeIdToEventId.indexOf(selectedNodeId);
            if (edgeIdx >= 0) {
                const edge = edges[edgeIdx];
                const a = idToIndex.get(edge.source);
                const b = idToIndex.get(edge.target);
                const indices = [a, b].filter((i): i is number => i !== undefined);
                cosmo.selectPoints(indices);
                if (indices.length > 0) cosmo.setFocusedPoint(indices[0]);
            }
        }, [selectedNodeId, highlightedPath, idToIndex, edgeIdToEventId, edges]);

        // ---- event handlers ----
        const handleClick = useCallback(
            (index: number | undefined) => {
                if (index === undefined) {
                    onNodeClick('');
                    return;
                }
                const point = points[index];
                if (point) onNodeClick(point.id);
            },
            [onNodeClick, points],
        );

        const handleLinkClick = useCallback(
            (linkIndex: number) => {
                const eventId = edgeIdToEventId[linkIndex];
                if (eventId) onEdgeClick(eventId);
            },
            [onEdgeClick, edgeIdToEventId],
        );

        const handleLabelClick = useCallback(
            (_index: number, id: string) => {
                if (id) onNodeClick(id);
            },
            [onNodeClick],
        );

        const handlePointMouseOver = useCallback(
            (
                index: number,
                _position: [number, number],
                event:
                    | MouseEvent
                    | { sourceEvent?: MouseEvent }
                    | undefined,
            ) => {
                const point = points[index];
                if (!point) return;
                const mouseEvent =
                    event && 'clientX' in event
                        ? (event as MouseEvent)
                        : (event as { sourceEvent?: MouseEvent } | undefined)?.sourceEvent;
                if (!mouseEvent) return;
                setHover({
                    x: mouseEvent.clientX,
                    y: mouseEvent.clientY,
                    label: point.label,
                    sub: point.entityType
                        ? `${point.entityType.toUpperCase()}`
                        : undefined,
                });
            },
            [points],
        );

        const handlePointMouseOut = useCallback(() => setHover(null), []);

        // ---- edge label overlay ----
        const [edgeLabels, setEdgeLabels] = useState<EdgeLabel[]>([]);
        const rafRef = useRef<number | null>(null);

        const recomputeEdgeLabels = useCallback(() => {
            const cosmo = cosmoRef.current;
            if (!cosmo) return;
            const zoom = cosmo.getZoomLevel?.() ?? 1;
            if (zoom < EDGE_LABEL_MIN_ZOOM || edgeMeta.length === 0) {
                setEdgeLabels((prev) => (prev.length === 0 ? prev : []));
                return;
            }
            const next: EdgeLabel[] = [];
            for (let i = 0; i < edgeMeta.length; i += 1) {
                const m = edgeMeta[i];
                if (!m.label) continue;
                const src = cosmo.getPointPositionByIndex?.(m.sourceIndex);
                const tgt = cosmo.getPointPositionByIndex?.(m.targetIndex);
                if (!src || !tgt) continue;
                const screen = cosmo.spaceToScreenPosition?.([
                    (src[0] + tgt[0]) / 2,
                    (src[1] + tgt[1]) / 2,
                ]);
                if (!screen) continue;
                next.push({
                    eventId: m.eventId,
                    label: m.label,
                    x: screen[0],
                    y: screen[1],
                });
                if (next.length >= MAX_EDGE_LABELS) break;
            }
            setEdgeLabels(next);
        }, [edgeMeta]);

        const scheduleRecompute = useCallback(() => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                recomputeEdgeLabels();
            });
        }, [recomputeEdgeLabels]);

        useEffect(() => {
            return () => {
                if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            };
        }, []);

        // ---- persist settled layout ----
        const persistLayout = useCallback(() => {
            const cosmo = cosmoRef.current;
            if (!cosmo || !workspaceId) return;
            const flat = cosmo.getPointPositions();
            if (!flat) return;
            const positions: SavedPositions = {};
            for (let i = 0; i < points.length; i += 1) {
                const x = flat[i * 2];
                const y = flat[i * 2 + 1];
                if (Number.isFinite(x) && Number.isFinite(y)) {
                    positions[points[i].id] = [x, y];
                }
            }
            saveGraphLayout(workspaceId, positions);
        }, [workspaceId, points]);

        const handleSimulationEnd = useCallback(() => {
            recomputeEdgeLabels();
            persistLayout();
        }, [recomputeEdgeLabels, persistLayout]);

        // Save on unmount too, in case the user navigates away before the
        // simulation settles. Ref keeps the cleanup from capturing a stale fn.
        const persistLayoutRef = useRef(persistLayout);
        persistLayoutRef.current = persistLayout;
        useEffect(() => {
            return () => persistLayoutRef.current();
        }, []);

        const handleEdgeLabelClick = useCallback(
            (eventId: string, e: React.MouseEvent) => {
                e.stopPropagation();
                onEdgeClick(eventId);
            },
            [onEdgeClick],
        );

        if (points.length === 0) {
            return (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No graph data yet.
                </div>
            );
        }

        return (
            <>
                <Cosmograph
                    ref={setRefs}
                    style={{ width: '100%', height: '100%' }}
                    points={points as unknown as Record<string, unknown>[]}
                    links={edges as unknown as Record<string, unknown>[]}
                    pointIdBy="id"
                    pointIndexBy="index"
                    pointLabelBy="label"
                    pointColorBy="color"
                    {...(hasSavedLayout
                        ? { pointXBy: 'x', pointYBy: 'y' }
                        : {})}
                    preservePointPositionsOnDataUpdate
                    linkSourceBy="source"
                    linkSourceIndexBy="sourceIndex"
                    linkTargetBy="target"
                    linkTargetIndexBy="targetIndex"
                    linkDefaultColor={EVENT_EDGE_COLOR}
                    pointDefaultSize={10}
                    pointSizeRange={[7, 20]}
                    pointSizeStrategy="degree"
                    linkArrowsSizeScale={1}
                    backgroundColor="transparent"
                    enableSimulation
                    simulationDecay={1000}
                    simulationGravity={0.25}
                    simulationRepulsion={1.0}
                    simulationLinkSpring={1.0}
                    simulationLinkDistance={8}
                    simulationFriction={0.85}
                    fitViewOnInit
                    fitViewDelay={250}
                    selectPointOnClick={false}
                    focusPointOnClick={false}
                    selectPointOnLabelClick={false}
                    focusPointOnLabelClick={false}
                    resetSelectionOnEmptyCanvasClick={false}
                    showLabels
                    showDynamicLabels
                    showHoveredPointLabel
                    showFocusedPointLabel
                    pointGreyoutOpacity={0.15}
                    linkGreyoutOpacity={0.05}
                    focusedPointRingColor="#f97316"
                    hoveredPointRingColor="#ffffff"
                    onClick={handleClick}
                    onLinkClick={handleLinkClick}
                    onLabelClick={handleLabelClick}
                    onPointMouseOver={handlePointMouseOver}
                    onPointMouseOut={handlePointMouseOut}
                    onSimulationTick={scheduleRecompute}
                    onSimulationEnd={handleSimulationEnd}
                    onZoom={scheduleRecompute}
                />
                {hover && (
                    <div
                        className="pointer-events-none fixed z-50 rounded-lg border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-xl whitespace-nowrap -translate-x-1/2 -translate-y-[calc(100%+0.5rem)]"
                        style={{ left: hover.x, top: hover.y }}
                    >
                        <div className="font-medium">{hover.label || 'Unknown'}</div>
                        {hover.sub && (
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {hover.sub}
                            </div>
                        )}
                    </div>
                )}
                {edgeLabels.map((l) => (
                    <button
                        key={l.eventId}
                        type="button"
                        onClick={(e) => handleEdgeLabelClick(l.eventId, e)}
                        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white hover:bg-black/90 hover:text-orange-300 transition-colors whitespace-nowrap cursor-pointer"
                        style={{ left: l.x, top: l.y }}
                    >
                        {l.label}
                    </button>
                ))}
            </>
        );
    },
);
