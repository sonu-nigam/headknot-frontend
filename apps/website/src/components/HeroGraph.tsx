import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import type { Edge, IdType, Node, Options } from 'vis-network';

// The hero "Unified Lattice": a central Headknot hub that connects scattered
// source tools (Notion, Slack, Drive…) and the knowledge entities extracted from
// them into one connected graph. Rendered with vis-network on a fixed, centered
// layout: physics is off and we drive a gentle in-place drift ourselves, so the
// frame never moves while the nodes wander slowly.

type Kind = 'hub' | 'source' | 'concept' | 'highlight';

interface RawNode {
    id: string;
    label: string;
    kind: Kind;
}

const KIND_COLOR: Record<Kind, string> = {
    hub: '#8b5cf6', // violet-500 — the Headknot core
    source: '#4cd7f6', // cyan — connected tools (echoes the Stitch lattice gradient)
    concept: '#c4b5fd', // violet-300 — extracted knowledge
    highlight: '#f59e0b', // amber — an emphasized entity
};

const NODES: RawNode[] = [
    { id: 'headknot', label: 'Headknot', kind: 'hub' },
    // Connected source tools
    { id: 'notion', label: 'Notion', kind: 'source' },
    { id: 'slack', label: 'Slack', kind: 'source' },
    { id: 'jira', label: 'Jira', kind: 'source' },
    { id: 'github', label: 'GitHub', kind: 'source' },
    { id: 'drive', label: 'Drive', kind: 'source' },
    // Extracted knowledge entities
    { id: 'strategy', label: 'Strategy', kind: 'concept' },
    { id: 'customers', label: 'Customers', kind: 'concept' },
    { id: 'pricing', label: 'Pricing', kind: 'concept' },
    { id: 'roadmap', label: 'Roadmap', kind: 'concept' },
    { id: 'okrs', label: 'Q3 OKRs', kind: 'concept' },
    { id: 'decisions', label: 'Decisions', kind: 'concept' },
    { id: 'renewals', label: 'Renewals', kind: 'concept' },
    { id: 'churn', label: 'Churn', kind: 'highlight' },
];

const EDGES: Array<[string, string]> = [
    // Hub binds every knowledge entity together.
    ['headknot', 'strategy'],
    ['headknot', 'customers'],
    ['headknot', 'pricing'],
    ['headknot', 'roadmap'],
    ['headknot', 'okrs'],
    ['headknot', 'decisions'],
    ['headknot', 'renewals'],
    ['headknot', 'churn'],
    // Sources feed into the entities they mention.
    ['notion', 'strategy'],
    ['notion', 'roadmap'],
    ['notion', 'okrs'],
    ['slack', 'customers'],
    ['slack', 'churn'],
    ['slack', 'decisions'],
    ['jira', 'roadmap'],
    ['jira', 'okrs'],
    ['github', 'roadmap'],
    ['github', 'decisions'],
    ['drive', 'strategy'],
    ['drive', 'pricing'],
    ['drive', 'customers'],
    // Entities relate to one another — the lattice.
    ['customers', 'churn'],
    ['churn', 'renewals'],
    ['pricing', 'renewals'],
    ['strategy', 'okrs'],
    ['roadmap', 'decisions'],
];

// Fixed, deterministic layout so the graph renders static (no force settling):
// the hub at the center, knowledge entities on an inner ring, and the source
// tools on an outer ring — a clean concentric lattice.
const INNER_RADIUS = 150;
const OUTER_RADIUS = 300;

function buildLayout(): Map<string, [number, number]> {
    const pos = new Map<string, [number, number]>();
    pos.set('headknot', [0, 0]);

    const inner = NODES.filter(
        (n) => n.kind === 'concept' || n.kind === 'highlight',
    );
    const sources = NODES.filter((n) => n.kind === 'source');

    inner.forEach((n, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / inner.length;
        pos.set(n.id, [Math.cos(a) * INNER_RADIUS, Math.sin(a) * INNER_RADIUS]);
    });
    sources.forEach((n, i) => {
        // Offset the outer ring so sources sit between the inner nodes.
        const a =
            -Math.PI / 2 +
            (i * 2 * Math.PI) / sources.length +
            Math.PI / sources.length;
        pos.set(n.id, [Math.cos(a) * OUTER_RADIUS, Math.sin(a) * OUTER_RADIUS]);
    });
    return pos;
}

// --- visual constants -------------------------------------------------------
const LABEL_COLOR = 'rgba(255,255,255,0.78)';
const LABEL_DIM = 'rgba(255,255,255,0.22)';
const EDGE_COLOR = 'rgba(196,181,253,0.22)';
const EDGE_HIGHLIGHT = 'rgba(196,181,253,0.85)';
const EDGE_DIM = 'rgba(196,181,253,0.05)';

// Gentle in-place drift: each non-hub node orbits a tiny ellipse around its
// fixed anchor. Amplitude is small vs. the ring radii and the speed is slow, so
// it reads as an ambient wander rather than motion.
const DRIFT_AMPLITUDE = 7; // px
const DRIFT_SPEED = 0.00018; // radians per ms (~one cycle every ~35s)

// Node size mapped from connection count, mirroring the old degree-based sizing
// (range 7..30) so the well-connected hub stays the visual anchor.
function buildDegree(): Map<string, number> {
    const degree = new Map<string, number>(NODES.map((n) => [n.id, 0]));
    for (const [a, b] of EDGES) {
        degree.set(a, (degree.get(a) ?? 0) + 1);
        degree.set(b, (degree.get(b) ?? 0) + 1);
    }
    return degree;
}

// rgba string from a #rrggbb hex + alpha — used to dim node colors on hover.
function withAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function HeroGraph({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const layout = buildLayout();
        const degree = buildDegree();
        const degVals = [...degree.values()];
        const dMin = Math.min(...degVals);
        const dMax = Math.max(...degVals);
        const sizeFor = (id: string) => {
            const d = degree.get(id) ?? 0;
            const t = dMax === dMin ? 1 : (d - dMin) / (dMax - dMin);
            return 7 + t * (30 - 7);
        };

        const nodes = new DataSet<Node>(
            NODES.map((n) => {
                const [x, y] = layout.get(n.id) ?? [0, 0];
                const base = KIND_COLOR[n.kind];
                return {
                    id: n.id,
                    label: n.label,
                    x,
                    y,
                    fixed: { x: n.kind === 'hub', y: n.kind === 'hub' },
                    shape: 'dot',
                    size: sizeFor(n.id),
                    color: {
                        background: base,
                        border: base,
                        highlight: { background: base, border: base },
                    },
                    font: { color: LABEL_COLOR, size: 12 },
                };
            }),
        );

        const edges = new DataSet<Edge>(
            EDGES.map(([from, to], i) => ({
                id: i,
                from,
                to,
                color: { color: EDGE_COLOR, inherit: false },
                width: 1,
                smooth: false,
            })),
        );

        const options: Options = {
            physics: { enabled: false },
            layout: { improvedLayout: false },
            interaction: {
                hover: true,
                dragNodes: false,
                dragView: false,
                zoomView: false,
                selectable: false,
                selectConnectedEdges: false,
            },
            nodes: { borderWidth: 0 },
            edges: { color: { inherit: false } },
        };

        const network = new Network(el, { nodes, edges }, options);

        // Frame the whole graph exactly once. Interaction is disabled and the
        // drift amplitude is tiny, so it stays centered without any re-fitting.
        network.once('afterDrawing', () => {
            network.fit({ animation: false });
        });

        // --- hover highlight: brighten the hovered node + its neighbors and
        // incident edges, dim everything else. Restored on blur. ---
        const neighbors = new Map<IdType, Set<IdType>>();
        const incidentEdges = new Map<IdType, Set<number>>();
        for (const n of NODES) {
            neighbors.set(n.id, new Set([n.id]));
            incidentEdges.set(n.id, new Set());
        }
        EDGES.forEach(([a, b], i) => {
            neighbors.get(a)?.add(b);
            neighbors.get(b)?.add(a);
            incidentEdges.get(a)?.add(i);
            incidentEdges.get(b)?.add(i);
        });

        const applyHover = (hoveredId: IdType | null) => {
            nodes.update(
                NODES.map((n) => {
                    const base = KIND_COLOR[n.kind];
                    const lit =
                        hoveredId === null ||
                        neighbors.get(hoveredId)?.has(n.id);
                    const color = lit ? base : withAlpha(base, 0.18);
                    return {
                        id: n.id,
                        color: {
                            background: color,
                            border: color,
                            highlight: { background: color, border: color },
                        },
                        font: { color: lit ? LABEL_COLOR : LABEL_DIM, size: 12 },
                    };
                }),
            );
            const incident =
                hoveredId === null ? null : incidentEdges.get(hoveredId);
            edges.update(
                EDGES.map((_edge, i) => {
                    const c =
                        hoveredId === null
                            ? EDGE_COLOR
                            : incident?.has(i)
                              ? EDGE_HIGHLIGHT
                              : EDGE_DIM;
                    return { id: i, color: { color: c, inherit: false } };
                }),
            );
        };

        network.on('hoverNode', (params: { node: IdType }) =>
            applyHover(params.node),
        );
        network.on('blurNode', () => applyHover(null));

        // --- gentle perpetual drift via direct position control (physics off) ---
        const anchors = NODES.filter((n) => n.kind !== 'hub').map((n, idx) => {
            const [ax, ay] = layout.get(n.id) ?? [0, 0];
            return { id: n.id, ax, ay, phase: idx * 1.7 };
        });
        let raf = 0;
        const start = performance.now();
        const tick = (t: number) => {
            const dt = t - start;
            for (const a of anchors) {
                const dx = Math.cos(dt * DRIFT_SPEED + a.phase) * DRIFT_AMPLITUDE;
                const dy =
                    Math.sin(dt * DRIFT_SPEED * 0.8 + a.phase) * DRIFT_AMPLITUDE;
                network.moveNode(a.id, a.ax + dx, a.ay + dy);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            network.destroy();
        };
    }, []);

    return (
        <div ref={containerRef} className={`hero-graph ${className ?? ''}`} />
    );
}
