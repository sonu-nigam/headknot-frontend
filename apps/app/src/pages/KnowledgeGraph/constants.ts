export const ENTITY_COLORS: Record<string, string> = {
    person: '#22c55e',
    place: '#3b82f6',
    organization: '#f59e0b',
    concept: '#a855f7',
    technology: '#06b6d4',
    event: '#ec4899',
    other: '#6b7280',
};

export const EVENT_NODE_COLOR = '#f472b6';

export const ENTITY_TYPE_LABELS: Record<string, string> = {
    person: 'Person',
    place: 'Place',
    organization: 'Organization',
    concept: 'Concept',
    technology: 'Technology',
    event: 'Event',
    other: 'Other',
};

export const LINK_COLORS: Record<string, string> = {
    SUBJECT_OF: '#8b5cf6',
    OBJECT_OF: '#06b6d4',
};

/** Normalize entity type from backend (PERSON → person) for color/label lookup */
export function normalizeEntityType(type?: string): string {
    return (type ?? 'other').toLowerCase();
}
