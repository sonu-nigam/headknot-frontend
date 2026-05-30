// Decorative knowledge-graph mock used in the hero. Pure SVG, no data.
const NODES = [
    { id: 'a', x: 130, y: 90, r: 26, label: 'Pricing', tone: 'brand' },
    { id: 'b', x: 320, y: 60, r: 20, label: 'Roadmap', tone: 'muted' },
    { id: 'c', x: 470, y: 120, r: 24, label: 'Customers', tone: 'muted' },
    { id: 'd', x: 250, y: 210, r: 30, label: 'Strategy', tone: 'brand' },
    { id: 'e', x: 440, y: 270, r: 20, label: 'Churn', tone: 'muted' },
    { id: 'f', x: 110, y: 250, r: 18, label: 'Q3 OKRs', tone: 'muted' },
    { id: 'g', x: 360, y: 360, r: 22, label: 'Renewals', tone: 'highlight' },
] as const;

const EDGES: Array<[string, string]> = [
    ['a', 'd'],
    ['b', 'd'],
    ['c', 'd'],
    ['d', 'f'],
    ['c', 'e'],
    ['d', 'e'],
    ['e', 'g'],
    ['c', 'g'],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function toneFill(tone: string) {
    if (tone === 'brand') return '#7c3aed';
    if (tone === 'highlight') return '#f59e0b';
    return '#1e1b2e';
}

export function GraphVisual({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 580 420"
            className={className}
            role="img"
            aria-label="A knowledge graph connecting concepts like strategy, customers, pricing and churn"
        >
            <defs>
                <radialGradient id="graph-bg" cx="50%" cy="35%" r="75%">
                    <stop offset="0%" stopColor="rgba(124,58,237,0.18)" />
                    <stop offset="100%" stopColor="rgba(124,58,237,0)" />
                </radialGradient>
            </defs>

            <rect x="0" y="0" width="580" height="420" fill="url(#graph-bg)" />

            {EDGES.map(([from, to]) => {
                const a = byId[from];
                const b = byId[to];
                return (
                    <line
                        key={`${from}-${to}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="rgba(196,181,253,0.35)"
                        strokeWidth="1.5"
                    />
                );
            })}

            {NODES.map((n) => (
                <g key={n.id}>
                    <circle
                        cx={n.x}
                        cy={n.y}
                        r={n.r}
                        fill={toneFill(n.tone)}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="1.5"
                    />
                    <text
                        x={n.x}
                        y={n.y + n.r + 16}
                        textAnchor="middle"
                        fontSize="13"
                        fill="rgba(255,255,255,0.7)"
                        fontWeight="500"
                    >
                        {n.label}
                    </text>
                </g>
            ))}
        </svg>
    );
}
