import { useEffect, useMemo, useRef } from 'react';
import { Cosmograph, type CosmographRef } from '@cosmograph/react';

// The hero "Unified Lattice": a central Headknot hub that connects scattered
// source tools (Notion, Slack, Jira…) and the knowledge entities extracted from
// them into one living graph. Rendered with Cosmograph (WebGL) so it settles
// into an organic, force-directed layout instead of a hand-placed SVG.

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
    highlight: '#f59e0b', // amber — a flagged / evolving entity
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

// Fraction of the viewport left as margin when framing the graph — lower fills
// more of the canvas.
const FIT_PADDING = 0.3;

export function HeroGraph({ className }: { className?: string }) {
    const cosmoRef = useRef<CosmographRef | null>(null);

    const { points, links } = useMemo(() => {
        const layout = buildLayout();
        const indexById = new Map(NODES.map((n, i) => [n.id, i]));
        const points = NODES.map((n, i) => {
            const [x, y] = layout.get(n.id) ?? [0, 0];
            return {
                id: n.id,
                index: i,
                label: n.label,
                color: KIND_COLOR[n.kind],
                x,
                y,
            };
        });
        const links = EDGES.map(([source, target]) => ({
            source,
            target,
            sourceIndex: indexById.get(source)!,
            targetIndex: indexById.get(target)!,
        }));
        return { points, links };
    }, []);

    // A force simulation is Cosmograph's only way to move nodes (re-uploading
    // positions per frame is not), so we keep a perpetual, very gentle drift by
    // re-energising it with a tiny alpha. A separate, continuous re-fit keeps
    // the slowly-drifting cluster centered and filling the frame — so visually
    // the graph stays put in the middle while its nodes wobble very slowly.
    useEffect(() => {
        const nudge = window.setInterval(() => {
            cosmoRef.current?.start?.(0.008);
        }, 3000);
        const refit = window.setInterval(() => {
            cosmoRef.current?.fitView?.(900, FIT_PADDING);
        }, 900);
        return () => {
            window.clearInterval(nudge);
            window.clearInterval(refit);
        };
    }, []);

    // Fit as soon as the initial layout settles, so it's framed immediately.
    const handleSimulationEnd = () => {
        cosmoRef.current?.fitView?.(600, FIT_PADDING);
    };

    return (
        <div className={`hero-graph ${className ?? ''}`}>
            <Cosmograph
                ref={cosmoRef}
                style={{ width: '100%', height: '100%' }}
                points={points as unknown as Record<string, unknown>[]}
                links={links as unknown as Record<string, unknown>[]}
                pointIdBy="id"
                pointIndexBy="index"
                pointLabelBy="label"
                pointColorBy="color"
                pointXBy="x"
                pointYBy="y"
                linkSourceBy="source"
                linkSourceIndexBy="sourceIndex"
                linkTargetBy="target"
                linkTargetIndexBy="targetIndex"
                backgroundColor="transparent"
                spaceSize={4096}
                // Size nodes by how connected they are — the hub becomes the
                // visual anchor without hard-coding a size per node.
                pointSizeStrategy="degree"
                pointSizeRange={[7, 30]}
                linkDefaultColor="rgba(196,181,253,0.22)"
                linkArrowsSizeScale={0}
                // Near-zero gravity is the key to a STABLE spread: gravity is
                // what pulls nodes together, so keeping it tiny stops re-heating
                // from collapsing the layout. The center force pins the centroid
                // (no wandering) while repulsion + links hold the spacing. High
                // friction keeps the motion slow and soft.
                enableSimulation
                simulationGravity={0.03}
                simulationCenter={1}
                simulationRepulsion={2}
                simulationLinkSpring={0.4}
                simulationLinkDistance={40}
                simulationFriction={0.9}
                simulationDecay={1000}
                // Camera fit is driven imperatively after the layout settles
                // (and re-fit after each gentle nudge) to keep it centered.
                fitViewOnInit={false}
                onSimulationEnd={handleSimulationEnd}
                // The frame is static — no panning, zooming or dragging.
                enableZoom={false}
                enableDrag={false}
                showLabels
                showTopLabels
                showTopLabelsLimit={NODES.length}
                showHoveredPointLabel
                pointLabelColor="rgba(255,255,255,0.78)"
                pointLabelFontSize={11}
                hoveredPointRingColor="#c4b5fd"
                selectPointOnClick={false}
                focusPointOnClick={false}
                resetSelectionOnEmptyCanvasClick={false}
            />
        </div>
    );
}
