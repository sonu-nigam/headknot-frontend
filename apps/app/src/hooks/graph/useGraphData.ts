import { useMemo } from 'react';
import { Schemas } from '@/types/api';

export interface GraphNode {
    id: string;
    label: string;
    type: 'entity';
    entityType?: string;
    data: Schemas['Node'];
}

export interface GraphLink {
    source: string;
    target: string;
    eventId: string;
    eventLabel: string;
    eventData: Schemas['Edge'];
}

export function useGraphData(
    graphData: Schemas['GraphVisualizationResponse'] | undefined,
    entityTypeFilters: Set<string>,
) {
    return useMemo(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        if (!graphData?.nodes) return { nodes, links };

        const entityMap = new Set<string>();

        for (const node of graphData.nodes) {
            if (!node.id) continue;
            if (
                entityTypeFilters.size > 0 &&
                node.entityType &&
                !entityTypeFilters.has(node.entityType.toLowerCase())
            ) {
                continue;
            }
            entityMap.add(node.id);
            nodes.push({
                id: node.id,
                label: node.name ?? 'Unnamed',
                type: 'entity',
                entityType: node.entityType?.toLowerCase(),
                data: node,
            });
        }

        if (!graphData.edges) return { nodes, links };

        const addedEdges = new Set<string>();

        for (const edge of graphData.edges) {
            if (!edge.id) continue;
            if (addedEdges.has(edge.id)) continue;

            if (!edge.source || !edge.target) continue;
            if (!entityMap.has(edge.source) || !entityMap.has(edge.target)) continue;

            addedEdges.add(edge.id);

            links.push({
                source: edge.source,
                target: edge.target,
                eventId: edge.id,
                eventLabel: edge.eventType ?? 'Event',
                eventData: edge,
            });
        }

        return { nodes, links };
    }, [graphData, entityTypeFilters]);
}
