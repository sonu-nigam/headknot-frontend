import { useMemo } from 'react';
import { Schemas } from '@/types/api';

export interface GraphNode {
    id: string;
    label: string;
    type: 'entity' | 'event';
    entityType?: string;
    data: Schemas['GraphEntityResponse'] | Schemas['EventNodeDetailResponse'];
}

export interface GraphLink {
    source: string;
    target: string;
    type: 'SUBJECT_OF' | 'OBJECT_OF';
}

export function useGraphData(
    entities: Schemas['GraphEntityResponse'][] | undefined,
    eventDetails: Schemas['EventNodeDetailResponse'][] | undefined,
    entityTypeFilters: Set<string>,
) {
    return useMemo(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        if (!entities) return { nodes, links };

        const entityMap = new Set<string>();

        for (const entity of entities) {
            if (!entity.id) continue;
            if (
                entityTypeFilters.size > 0 &&
                entity.entityType &&
                !entityTypeFilters.has(entity.entityType.toLowerCase())
            ) {
                continue;
            }
            entityMap.add(entity.id);
            nodes.push({
                id: entity.id,
                label: entity.name ?? 'Unnamed',
                type: 'entity',
                entityType: entity.entityType?.toLowerCase(),
                data: entity,
            });
        }

        if (!eventDetails) return { nodes, links };

        const addedEvents = new Set<string>();

        for (const event of eventDetails) {
            if (!event.id) continue;
            if (addedEvents.has(event.id)) continue;

            const subjectId = event.subject?.id;
            const objectId = event.object?.id;

            if (!subjectId || !objectId) continue;
            if (!entityMap.has(subjectId) || !entityMap.has(objectId)) continue;

            addedEvents.add(event.id);

            nodes.push({
                id: event.id,
                label: event.eventType ?? 'Event',
                type: 'event',
                data: event,
            });

            links.push({
                source: subjectId,
                target: event.id,
                type: 'SUBJECT_OF',
            });
            links.push({
                source: event.id,
                target: objectId,
                type: 'OBJECT_OF',
            });
        }

        return { nodes, links };
    }, [entities, eventDetails, entityTypeFilters]);
}
