import { ENTITY_COLORS, EVENT_NODE_COLOR } from './constants';
import type { GraphNode } from '@/hooks/graph/useGraphData';

export function truncateLabel(text: string, maxLen: number = 14): string {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen - 1) + '…';
}

export function getNodeColor(node: GraphNode): string {
    if (node.type === 'event') return EVENT_NODE_COLOR;
    return ENTITY_COLORS[node.entityType ?? 'other'] ?? ENTITY_COLORS.other;
}

export function isEntityNode(node: GraphNode): boolean {
    return node.type === 'entity';
}

export function isEventNode(node: GraphNode): boolean {
    return node.type === 'event';
}
