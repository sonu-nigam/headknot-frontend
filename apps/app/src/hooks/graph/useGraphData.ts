import { useMemo } from 'react';
import { Schemas } from '@/types/api';

export interface GraphNode {
    id: string;
    label: string;
    type: 'entity' | 'event';
    entityType?: string;
    data: Schemas['GraphEntityResponse'] | Schemas['GraphEventResponse'];
}

export interface GraphLink {
    source: string;
    target: string;
    type: 'SUBJECT_OF' | 'OBJECT_OF';
}

export function useGraphData(
    entities: Schemas['GraphEntityResponse'][] | undefined,
    events: Schemas['GraphEventResponse'][] | undefined,
    entityTypeFilters: Set<string>,
) {
    return useMemo(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        if (!entities || !events) return { nodes, links };

        const entityMap = new Set<string>();

        for (const entity of entities) {
            if (!entity.id) continue;
            if (
                entityTypeFilters.size > 0 &&
                entity.entityType &&
                !entityTypeFilters.has(entity.entityType)
            ) {
                continue;
            }
            entityMap.add(entity.id);
            nodes.push({
                id: entity.id,
                label: entity.name ?? 'Unnamed',
                type: 'entity',
                entityType: entity.entityType,
                data: entity,
            });
        }

        for (const event of events) {
            if (!event.id || !event.subjectId || !event.objectId) continue;
            if (!entityMap.has(event.subjectId) || !entityMap.has(event.objectId))
                continue;

            nodes.push({
                id: event.id,
                label: event.label ?? 'Event',
                type: 'event',
                data: event,
            });

            links.push({
                source: event.subjectId,
                target: event.id,
                type: 'SUBJECT_OF',
            });
            links.push({
                source: event.id,
                target: event.objectId,
                type: 'OBJECT_OF',
            });
        }

        return { nodes, links };
    }, [entities, events, entityTypeFilters]);
}
