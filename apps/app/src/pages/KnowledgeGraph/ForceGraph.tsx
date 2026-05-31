import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import type { Edge, IdType, Node, Options } from 'vis-network';
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
    /** Reports the selected node/edge's on-screen position so a detail card can anchor to it. */
    onAnchorChange?: (anchor: { x: number; y: number } | null) => void;
    /** Fires when the selection's focus/fit animation finishes (node is in view). */
    onFocusSettled?: () => void;
}

/** Imperative surface consumed by GraphCanvas (camera + viewport snapshot). */
export interface ForceGraphHandle {
    getViewState(): { position: { x: number; y: number }; scale: number } | null;
    setViewState(
        v: { position: { x: number; y: number }; scale: number },
        durationMs: number,
    ): void;
    zoomBy(factor: number): void;
    fit(): void;
}

type VisNode = Node & { id: string };
type VisEdge = Edge & { id: string };

const FOCUS_COLOR = '#f97316'; // orange ring on the focused node
const HOVER_BORDER = '#ffffff';
const NODE_DIM = 0.15; // ↔ Cosmograph pointGreyoutOpacity
const EDGE_DIM = 0.05; // ↔ Cosmograph linkGreyoutOpacity
const LABEL_LIT = 'rgba(255,255,255,0.95)';
const LABEL_DIM = 'rgba(255,255,255,0.2)';
/** Dark halo behind label text so it stays readable over edges and the dot grid. */
const LABEL_STROKE = 'rgba(11,11,22,0.92)';
const NODE_LABEL_SIZE = 13;
/** All nodes render at this fixed radius (no degree-based scaling). */
const NODE_SIZE = 14;
const EDGE_LABEL_SIZE = 11;
/** Solid chip behind edge labels so the relationship text reads cleanly over edges/nodes. */
const EDGE_LABEL_BG = 'rgba(11,11,22,0.9)';
/** Above this many edges, drop on-canvas labels — drawing thousands of text strokes is costly. */
const EDGE_LABEL_CAP = 200;
/**
 * Show labels only when zoomed in past this scale. Below it the graph is small
 * enough that labels would overlap into unreadable fragments, so we hide them
 * entirely — either a full label is shown or none is.
 */
const LABEL_MIN_SCALE = 0.65;
/** Zoom level a node animates to when clicked (never zooms out below current). */
const FOCUS_SCALE = 1.5;

/** Node label styling — constant size + dark halo so labels are always legible. */
function nodeFont(lit: boolean) {
    return {
        color: lit ? LABEL_LIT : LABEL_DIM,
        size: NODE_LABEL_SIZE,
        strokeWidth: 3,
        strokeColor: LABEL_STROKE,
    };
}

/** rgba() from a #rrggbb hex + alpha — used to dim node/edge colors. */
function withAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface HoverState {
    x: number;
    y: number;
    label: string;
    sub?: string;
}

interface NodeMeta {
    label: string;
    color: string;
    entityType: string;
}

export const ForceGraph = forwardRef<ForceGraphHandle, ForceGraphProps>(
    function ForceGraph(
        {
            nodes,
            links,
            selectedNodeId,
            highlightedPath,
            onNodeClick,
            onEdgeClick,
            onAnchorChange,
            onFocusSettled,
        },
        ref,
    ) {
        const [hover, setHover] = useState<HoverState | null>(null);
        // Entrance animation: the graph expands from the center once the layout
        // settles, instead of slowly fading in as physics stabilizes.
        const [revealed, setRevealed] = useState(false);
        const revealedOnceRef = useRef(false);
        const reveal = useCallback(() => {
            if (revealedOnceRef.current) return;
            revealedOnceRef.current = true;
            setRevealed(true);
        }, []);

        const workspaceId = useAppStore((s) => s.selectedWorkspaceId) ?? '';
        const savedPositions = useMemo(
            () => loadGraphLayout(workspaceId),
            [workspaceId],
        );

        // ---- derive everything we need from the raw graph data ----
        const derived = useMemo(() => {
            // Centroid of saved positions — new (unsaved) entities spawn here with
            // a small jitter so physics pulls them into the existing cluster.
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

            const allNodeIds = new Set<string>();
            const nodeMetaById = new Map<string, NodeMeta>();
            const neighbors = new Map<string, Set<string>>();
            const incidentEdges = new Map<string, Set<string>>();

            const nodeEntries = nodes.map((n) => {
                allNodeIds.add(n.id);
                const color = getNodeColor(n);
                nodeMetaById.set(n.id, {
                    label: n.label || 'Unknown',
                    color,
                    entityType: n.entityType ?? '',
                });
                neighbors.set(n.id, new Set([n.id]));
                incidentEdges.set(n.id, new Set());
                const saved = savedPositions[n.id];
                return {
                    id: n.id,
                    label: n.label || 'Unknown',
                    color,
                    seedX: saved ? saved[0] : cx + (Math.random() - 0.5) * 20,
                    seedY: saved ? saved[1] : cy + (Math.random() - 0.5) * 20,
                };
            });

            const allEdgeIds = new Set<string>();
            const edgeMap = new Map<string, { from: string; to: string }>();
            const seen = new Set<string>();
            const edgeEntries: {
                id: string;
                from: string;
                to: string;
                label: string;
            }[] = [];
            for (const l of links) {
                if (!allNodeIds.has(l.source) || !allNodeIds.has(l.target))
                    continue;
                if (seen.has(l.eventId)) continue;
                seen.add(l.eventId);
                allEdgeIds.add(l.eventId);
                edgeMap.set(l.eventId, { from: l.source, to: l.target });
                neighbors.get(l.source)?.add(l.target);
                neighbors.get(l.target)?.add(l.source);
                incidentEdges.get(l.source)?.add(l.eventId);
                incidentEdges.get(l.target)?.add(l.eventId);
                edgeEntries.push({
                    id: l.eventId,
                    from: l.source,
                    to: l.target,
                    label: (l.eventLabel ?? '').replace(/_/g, ' ').toLowerCase(),
                });
            }

            return {
                cx,
                cy,
                nodeEntries,
                edgeEntries,
                neighbors,
                incidentEdges,
                edgeMap,
                nodeMetaById,
                allNodeIds,
                allEdgeIds,
                labelsEnabled: edgeEntries.length <= EDGE_LABEL_CAP,
            };
        }, [nodes, links, savedPositions]);

        // ---- mutable handles, read by the once-mounted network event wiring ----
        const containerRef = useRef<HTMLDivElement | null>(null);
        const networkRef = useRef<Network | null>(null);
        const nodesDsRef = useRef<DataSet<VisNode> | null>(null);
        const edgesDsRef = useRef<DataSet<VisEdge> | null>(null);
        const rafRef = useRef<number | null>(null);
        const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
        const stabilizedRef = useRef(false);
        const labelsShownRef = useRef(true);

        // Latest props/derived, so the once-wired handlers never go stale.
        const cbRef = useRef({
            onNodeClick,
            onEdgeClick,
            onAnchorChange,
            onFocusSettled,
        });
        cbRef.current = {
            onNodeClick,
            onEdgeClick,
            onAnchorChange,
            onFocusSettled,
        };
        const selRef = useRef({ selectedNodeId, highlightedPath });
        selRef.current = { selectedNodeId, highlightedPath };
        const dataRef = useRef(derived);
        dataRef.current = derived;
        const workspaceRef = useRef(workspaceId);
        workspaceRef.current = workspaceId;

        // Previous selection styling, for delta DataSet updates.
        const prevDimmingRef = useRef(false);
        const prevLitNodesRef = useRef<Set<string>>(new Set());
        const prevLitEdgesRef = useRef<Set<string>>(new Set());
        const prevFocusRef = useRef<string | null>(null);

        const baseNodeColor = useCallback((color: string) => {
            return {
                background: color,
                border: color,
                highlight: { background: color, border: color },
                hover: { background: color, border: HOVER_BORDER },
            };
        }, []);

        // ---- selection dimming (emulates Cosmograph greyout, store-driven) ----
        const applySelectionStyling = useCallback(
            (full = false) => {
                const nodesDs = nodesDsRef.current;
                const edgesDs = edgesDsRef.current;
                if (!nodesDs || !edgesDs) return;
                const d = dataRef.current;
                const { selectedNodeId: sel, highlightedPath: path } =
                    selRef.current;

                let dimming = true;
                const litNodes = new Set<string>();
                const litEdges = new Set<string>();
                let focus: string | null = null;

                if (path && path.length > 0) {
                    for (const id of path)
                        if (d.allNodeIds.has(id)) litNodes.add(id);
                    for (const [eid, e] of d.edgeMap)
                        if (litNodes.has(e.from) && litNodes.has(e.to))
                            litEdges.add(eid);
                    focus = litNodes.size ? [...litNodes][0] : null;
                } else if (!sel) {
                    dimming = false;
                } else if (d.allNodeIds.has(sel)) {
                    for (const nb of d.neighbors.get(sel) ?? []) litNodes.add(nb);
                    for (const eid of d.incidentEdges.get(sel) ?? [])
                        litEdges.add(eid);
                    focus = sel;
                } else if (d.edgeMap.has(sel)) {
                    const e = d.edgeMap.get(sel)!;
                    litNodes.add(e.from);
                    litNodes.add(e.to);
                    litEdges.add(sel);
                    focus = e.from;
                } else {
                    dimming = false;
                }

                const prevDimming = prevDimmingRef.current;
                const updateAll = full || dimming !== prevDimming;

                const nodeUpdates: VisNode[] = [];
                const touchNode = (id: string) => {
                    const meta = d.nodeMetaById.get(id);
                    if (!meta) return;
                    const lit = !dimming || litNodes.has(id);
                    const bg = lit ? meta.color : withAlpha(meta.color, NODE_DIM);
                    const isFocus = id === focus;
                    nodeUpdates.push({
                        id,
                        color: {
                            background: bg,
                            border: isFocus ? FOCUS_COLOR : bg,
                            highlight: {
                                background: bg,
                                border: isFocus ? FOCUS_COLOR : bg,
                            },
                            hover: { background: bg, border: HOVER_BORDER },
                        },
                        borderWidth: isFocus ? 3 : 1.5,
                        font: nodeFont(lit),
                    });
                };
                if (updateAll) {
                    for (const id of d.allNodeIds) touchNode(id);
                } else if (dimming) {
                    const set = new Set<string>([
                        ...prevLitNodesRef.current,
                        ...litNodes,
                    ]);
                    if (prevFocusRef.current) set.add(prevFocusRef.current);
                    if (focus) set.add(focus);
                    for (const id of set) touchNode(id);
                }
                if (nodeUpdates.length) nodesDs.update(nodeUpdates);

                const edgeUpdates: VisEdge[] = [];
                const touchEdge = (id: string) => {
                    const lit = !dimming || litEdges.has(id);
                    edgeUpdates.push({
                        id,
                        color: {
                            color: lit
                                ? EVENT_EDGE_COLOR
                                : withAlpha(EVENT_EDGE_COLOR, EDGE_DIM),
                            inherit: false,
                        },
                    });
                };
                if (updateAll) {
                    for (const id of d.allEdgeIds) touchEdge(id);
                } else if (dimming) {
                    const set = new Set<string>([
                        ...prevLitEdgesRef.current,
                        ...litEdges,
                    ]);
                    for (const id of set) touchEdge(id);
                }
                if (edgeUpdates.length) edgesDs.update(edgeUpdates);

                prevDimmingRef.current = dimming;
                prevLitNodesRef.current = litNodes;
                prevLitEdgesRef.current = litEdges;
                prevFocusRef.current = focus;
            },
            [],
        );

        // ---- anchor for the floating detail card ----
        const recomputeAnchor = useCallback(() => {
            const net = networkRef.current;
            const cb = cbRef.current;
            if (!cb.onAnchorChange) return;
            const sel = selRef.current.selectedNodeId;
            if (!net || !sel) {
                cb.onAnchorChange(null);
                return;
            }
            const d = dataRef.current;
            const finite = (p?: { x: number; y: number }) =>
                !!p && Number.isFinite(p.x) && Number.isFinite(p.y);

            if (d.allNodeIds.has(sel)) {
                const pos = net.getPositions([sel])[sel];
                const dom = pos && net.canvasToDOM(pos);
                cb.onAnchorChange(finite(dom) ? { x: dom.x, y: dom.y } : null);
                return;
            }
            const e = d.edgeMap.get(sel);
            if (e) {
                const ps = net.getPositions([e.from, e.to]);
                const a = ps[e.from];
                const b = ps[e.to];
                if (a && b) {
                    const dom = net.canvasToDOM({
                        x: (a.x + b.x) / 2,
                        y: (a.y + b.y) / 2,
                    });
                    cb.onAnchorChange(
                        finite(dom) ? { x: dom.x, y: dom.y } : null,
                    );
                    return;
                }
            }
            cb.onAnchorChange(null);
        }, []);

        // Show full labels only when zoomed in past LABEL_MIN_SCALE; otherwise
        // hide them so we never show overlapping fragments. Only writes to the
        // DataSets when the threshold is actually crossed (or when forced).
        const applyLabelVisibility = useCallback((force = false) => {
            const net = networkRef.current;
            const nodesDs = nodesDsRef.current;
            const edgesDs = edgesDsRef.current;
            if (!net || !nodesDs || !edgesDs) return;
            const scale = net.getScale();
            const show = !Number.isFinite(scale) || scale >= LABEL_MIN_SCALE;
            if (!force && show === labelsShownRef.current) return;
            labelsShownRef.current = show;
            const d = dataRef.current;
            // Node labels live per-node in the DataSet — toggle their text.
            nodesDs.update(
                [...d.allNodeIds].map((id) => ({
                    id,
                    label: show ? (d.nodeMetaById.get(id)?.label ?? '') : '',
                })),
            );
            // Edge labels use the global edge font (no per-edge override), so
            // collapsing the font size to 0 reliably hides them (a per-edge
            // DataSet label update doesn't always repaint in vis-network).
            net.setOptions({
                edges: { font: { size: show ? EDGE_LABEL_SIZE : 0 } },
            });
        }, []);

        const scheduleAnchor = useCallback(() => {
            if (rafRef.current !== null) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                recomputeAnchor();
            });
        }, [recomputeAnchor]);

        // ---- persist settled layout ----
        const persistLayout = useCallback(() => {
            const net = networkRef.current;
            const wid = workspaceRef.current;
            if (!net || !wid) return;
            const positions: SavedPositions = {};
            const all = net.getPositions();
            for (const id in all) {
                const { x, y } = all[id];
                if (Number.isFinite(x) && Number.isFinite(y))
                    positions[id] = [x, y];
            }
            saveGraphLayout(wid, positions);
        }, []);

        // ---- camera helpers ----
        const fitToNodes = useCallback(
            (ids: string[], durationMs: number, padFraction: number) => {
                const net = networkRef.current;
                if (!net || ids.length === 0) return;
                net.fit({
                    nodes: ids,
                    animation: {
                        duration: durationMs,
                        easingFunction: 'easeInOutQuad',
                    },
                });
                // vis fit() has no padding arg — shrink the scale afterwards.
                if (padFraction > 0) {
                    window.setTimeout(() => {
                        const cur = net.getScale();
                        const next = Math.min(
                            cur * (1 - Math.min(padFraction, 0.9)),
                            2,
                        );
                        net.moveTo({ scale: next, animation: false });
                    }, durationMs + 16);
                }
            },
            [],
        );

        // ---- create the network once ----
        useEffect(() => {
            const el = containerRef.current;
            if (!el) return;
            const nodesDs = new DataSet<VisNode>([]);
            const edgesDs = new DataSet<VisEdge>([]);
            nodesDsRef.current = nodesDs;
            edgesDsRef.current = edgesDs;

            const options: Options = {
                autoResize: true,
                layout: { improvedLayout: false },
                physics: {
                    enabled: true,
                    solver: 'barnesHut',
                    barnesHut: {
                        gravitationalConstant: -2000,
                        centralGravity: 0.25,
                        springLength: 60,
                        springConstant: 0.04,
                        damping: 0.15,
                        avoidOverlap: 0.1,
                    },
                    stabilization: { enabled: true, iterations: 1000, fit: true },
                    maxVelocity: 30,
                    minVelocity: 0.75,
                },
                nodes: {
                    shape: 'dot',
                    // Every node is the same fixed size. Labels stay a constant,
                    // legible size (set via font, no value-scaling).
                    size: NODE_SIZE,
                    borderWidth: 1.5,
                    font: nodeFont(true),
                },
                edges: {
                    color: { color: EVENT_EDGE_COLOR, inherit: false },
                    width: 1,
                    smooth: false,
                    arrows: { to: { enabled: true, scaleFactor: 0.5 } },
                    font: {
                        size: EDGE_LABEL_SIZE,
                        color: 'rgba(255,255,255,0.95)',
                        background: EDGE_LABEL_BG,
                        strokeWidth: 0,
                        align: 'horizontal',
                    },
                },
                interaction: {
                    hover: true,
                    dragNodes: true,
                    dragView: true,
                    zoomView: true,
                    selectable: false,
                    hoverConnectedEdges: false,
                },
            };

            const network = new Network(el, { nodes: nodesDs, edges: edgesDs }, options);
            networkRef.current = network;

            const onMouseMove = (e: MouseEvent) => {
                lastPointerRef.current = { x: e.clientX, y: e.clientY };
            };
            el.addEventListener('mousemove', onMouseMove);

            network.on(
                'click',
                (params: { pointer: { DOM: { x: number; y: number } } }) => {
                    const cb = cbRef.current;
                    // Selection is store-driven (interaction.selectable is off),
                    // so params.nodes/edges are always empty — hit-test the
                    // pointer directly to find what was clicked.
                    const nodeId = network.getNodeAt(params.pointer.DOM);
                    if (nodeId !== undefined && nodeId !== null) {
                        cb.onNodeClick(String(nodeId));
                        return;
                    }
                    const edgeId = network.getEdgeAt(params.pointer.DOM);
                    if (edgeId !== undefined && edgeId !== null) {
                        cb.onEdgeClick(String(edgeId));
                        return;
                    }
                    cb.onNodeClick('');
                },
            );
            network.on('hoverNode', (params: { node: IdType }) => {
                const meta = dataRef.current.nodeMetaById.get(String(params.node));
                if (!meta) return;
                const p = lastPointerRef.current;
                setHover({
                    x: p.x,
                    y: p.y,
                    label: meta.label,
                    sub: meta.entityType
                        ? meta.entityType.toUpperCase()
                        : undefined,
                });
            });
            network.on('blurNode', () => setHover(null));
            network.on('zoom', () => {
                applyLabelVisibility();
                scheduleAnchor();
            });
            network.on('dragging', scheduleAnchor);
            network.on('animationFinished', () => {
                // The focus/fit animation is done and the node is framed —
                // recompute its anchor and let the detail card become visible.
                recomputeAnchor();
                if (selRef.current.selectedNodeId) {
                    cbRef.current.onFocusSettled?.();
                }
            });
            network.on('dragEnd', () => {
                persistLayout();
                scheduleAnchor();
            });
            network.on('stabilizationIterationsDone', () => {
                stabilizedRef.current = true;
                network.setOptions({ physics: { enabled: false } });
                persistLayout();
                recomputeAnchor();
                // The graph just fit to view — apply label visibility for that zoom.
                applyLabelVisibility(true);
                reveal();
            });

            // Reveal even if stabilization never reports done (e.g. empty graph).
            const revealFallback = window.setTimeout(reveal, 800);

            return () => {
                el.removeEventListener('mousemove', onMouseMove);
                window.clearTimeout(revealFallback);
                if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
                persistLayout();
                network.destroy();
                networkRef.current = null;
                nodesDsRef.current = null;
                edgesDsRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // ---- sync data into the DataSets (diff, preserving positions) ----
        useEffect(() => {
            const nodesDs = nodesDsRef.current;
            const edgesDs = edgesDsRef.current;
            const net = networkRef.current;
            if (!nodesDs || !edgesDs || !net) return;
            const d = derived;

            const existingNodeIds = new Set(
                nodesDs.getIds().map((id) => String(id)),
            );
            let addedNew = false;

            const staleNodes = [...existingNodeIds].filter(
                (id) => !d.allNodeIds.has(id),
            );
            if (staleNodes.length) nodesDs.remove(staleNodes);

            nodesDs.update(
                d.nodeEntries.map((n) => {
                    const isNew = !existingNodeIds.has(n.id);
                    if (isNew) addedNew = true;
                    const seed = isNew ? { x: n.seedX, y: n.seedY } : {};
                    return {
                        id: n.id,
                        label: labelsShownRef.current ? n.label : '',
                        color: baseNodeColor(n.color),
                        borderWidth: 1.5,
                        font: nodeFont(true),
                        ...seed,
                    };
                }),
            );

            const existingEdgeIds = new Set(
                edgesDs.getIds().map((id) => String(id)),
            );
            const staleEdges = [...existingEdgeIds].filter(
                (id) => !d.allEdgeIds.has(id),
            );
            if (staleEdges.length) edgesDs.remove(staleEdges);

            edgesDs.update(
                d.edgeEntries.map((e) => ({
                    id: e.id,
                    from: e.from,
                    to: e.to,
                    label: d.labelsEnabled && e.label ? e.label : '',
                    color: { color: EVENT_EDGE_COLOR, inherit: false },
                })),
            );

            // New entities arrived after the graph had already settled — let
            // physics briefly re-run so they tuck into the cluster.
            if (addedNew && stabilizedRef.current) {
                stabilizedRef.current = false;
                net.setOptions({ physics: { enabled: true } });
                net.stabilize();
            }

            applySelectionStyling(true);
            recomputeAnchor();
        }, [derived, applySelectionStyling, recomputeAnchor, baseNodeColor]);

        // ---- reflect selection/path into styling + camera ----
        useEffect(() => {
            const net = networkRef.current;
            if (!net) return;
            applySelectionStyling();

            if (highlightedPath && highlightedPath.length > 0) {
                const ids = highlightedPath.filter((id) =>
                    derived.allNodeIds.has(id),
                );
                fitToNodes(ids, 600, 0.2);
            } else if (selectedNodeId && derived.allNodeIds.has(selectedNodeId)) {
                // Focus the clicked node: center on it and zoom in (but never
                // zoom further out than the user already is).
                net.focus(selectedNodeId, {
                    scale: Math.max(net.getScale(), FOCUS_SCALE),
                    locked: false,
                    animation: {
                        duration: 600,
                        easingFunction: 'easeInOutQuad',
                    },
                });
            } else if (selectedNodeId && derived.edgeMap.has(selectedNodeId)) {
                const e = derived.edgeMap.get(selectedNodeId)!;
                fitToNodes([e.from, e.to], 600, 0.3);
            }
            recomputeAnchor();
        }, [
            selectedNodeId,
            highlightedPath,
            derived,
            applySelectionStyling,
            recomputeAnchor,
            fitToNodes,
        ]);

        // ---- imperative handle for GraphCanvas ----
        useImperativeHandle(
            ref,
            (): ForceGraphHandle => ({
                getViewState() {
                    const net = networkRef.current;
                    if (!net) return null;
                    const scale = net.getScale();
                    if (!Number.isFinite(scale)) return null;
                    return { position: net.getViewPosition(), scale };
                },
                setViewState(v, durationMs) {
                    networkRef.current?.moveTo({
                        position: v.position,
                        scale: v.scale,
                        animation: {
                            duration: durationMs,
                            easingFunction: 'easeInOutQuad',
                        },
                    });
                },
                zoomBy(factor) {
                    const net = networkRef.current;
                    if (!net) return;
                    net.moveTo({
                        scale: net.getScale() * factor,
                        animation: { duration: 300, easingFunction: 'easeInOutQuad' },
                    });
                },
                fit() {
                    networkRef.current?.fit({
                        animation: {
                            duration: 500,
                            easingFunction: 'easeInOutQuad',
                        },
                    });
                },
            }),
            [],
        );

        return (
            <div className="relative h-full w-full">
                <div
                    className="h-full w-full"
                    style={{
                        transformOrigin: 'center center',
                        transition:
                            'transform 280ms ease-out, opacity 280ms ease-out',
                        transform: revealed ? 'scale(1)' : 'scale(0.5)',
                        opacity: revealed ? 1 : 0,
                    }}
                >
                    <div ref={containerRef} className="h-full w-full" />
                </div>
                {nodes.length === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                        No graph data yet.
                    </div>
                )}
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
            </div>
        );
    },
);
