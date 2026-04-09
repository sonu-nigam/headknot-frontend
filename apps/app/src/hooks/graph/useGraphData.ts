import { useMemo } from 'react';
import { Schemas } from '@/types/api';

export interface GraphNode {
    id: string;
    label: string;
    type: 'entity';
    entityType?: string;
    data: Schemas['GraphEntityResponse'];
}

export interface GraphLink {
    source: string;
    target: string;
    eventId: string;
    eventLabel: string;
    eventData: Schemas['EventNodeDetailResponse'];
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

            links.push({
                source: subjectId,
                target: objectId,
                eventId: event.id,
                eventLabel: event.eventType ?? 'Event',
                eventData: event,
            });
        }

        return { nodes, links };
    }, [entities, eventDetails, entityTypeFilters]);
}
