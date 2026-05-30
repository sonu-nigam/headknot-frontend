import { useMemo } from 'react';
import { Cosmograph } from '@cosmograph/react';

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

export function HeroGraph({ className }: { className?: string }) {
    const { points, links } = useMemo(() => {
        const indexById = new Map(NODES.map((n, i) => [n.id, i]));
        const points = NODES.map((n, i) => ({
            id: n.id,
            index: i,
            label: n.label,
            color: KIND_COLOR[n.kind],
        }));
        const links = EDGES.map(([source, target]) => ({
            source,
            target,
            sourceIndex: indexById.get(source)!,
            targetIndex: indexById.get(target)!,
        }));
        return { points, links };
    }, []);

    return (
        <div className={className}>
            <Cosmograph
                style={{ width: '100%', height: '100%' }}
                points={points as unknown as Record<string, unknown>[]}
                links={links as unknown as Record<string, unknown>[]}
                pointIdBy="id"
                pointIndexBy="index"
                pointLabelBy="label"
                pointColorBy="color"
                linkSourceBy="source"
                linkSourceIndexBy="sourceIndex"
                linkTargetBy="target"
                linkTargetIndexBy="targetIndex"
                backgroundColor="transparent"
                spaceSize={4096}
                // Size nodes by how connected they are — the hub becomes the
                // visual anchor without hard-coding a size per node.
                pointSizeStrategy="degree"
                pointSizeRange={[6, 26]}
                linkDefaultColor="rgba(196,181,253,0.22)"
                linkWidth={1}
                linkArrowsSizeScale={0}
                // Gentle force layout that settles into a lattice and stops.
                enableSimulation
                simulationGravity={0.2}
                simulationRepulsion={0.9}
                simulationLinkSpring={1.1}
                simulationLinkDistance={9}
                simulationFriction={0.85}
                simulationDecay={2000}
                fitViewOnInit
                fitViewDelay={250}
                fitViewPadding={0.45}
                // Decorative: let users nudge nodes, but never trap page scroll.
                enableZoom={false}
                enableDrag
                scalePointsOnZoom
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
