/**
 * Per-workspace persistence of knowledge-graph entity positions in localStorage.
 *
 * Cosmograph generates random positions on every mount; saving the settled
 * layout here lets the graph reopen in the same arrangement.
 */

export type SavedPositions = Record<string, [number, number]>;

const KEY_PREFIX = 'headknot:graph-layout:';
/** Bump to invalidate all previously stored layouts. */
const SCHEMA_VERSION = 1;

interface StoredLayout {
    v: number;
    positions: SavedPositions;
}

function keyFor(workspaceId: string): string {
    return `${KEY_PREFIX}${workspaceId}`;
}

export function loadGraphLayout(workspaceId: string): SavedPositions {
    if (!workspaceId) return {};
    try {
        const raw = localStorage.getItem(keyFor(workspaceId));
        if (!raw) return {};
        const parsed = JSON.parse(raw) as StoredLayout;
        if (
            parsed.v !== SCHEMA_VERSION ||
            typeof parsed.positions !== 'object' ||
            parsed.positions === null
        ) {
            return {};
        }
        return parsed.positions;
    } catch {
        return {};
    }
}

export function saveGraphLayout(
    workspaceId: string,
    positions: SavedPositions,
): void {
    if (!workspaceId) return;
    try {
        const payload: StoredLayout = { v: SCHEMA_VERSION, positions };
        localStorage.setItem(keyFor(workspaceId), JSON.stringify(payload));
    } catch {
        // Quota exceeded or storage disabled — persistence is best-effort.
    }
}
