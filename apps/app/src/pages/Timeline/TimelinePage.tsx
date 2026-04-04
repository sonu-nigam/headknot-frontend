import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { useAppStore } from '@/state/store';
import { Schemas } from '@/types/api';
import { workspaceChangesQueryOptions } from '@/query/options/timeline';
import { format, subDays } from 'date-fns';
import {
    Database,
    FileText,
    GitBranch,
    Brain,
    Clock,
    Filter,
    CalendarDays,
} from 'lucide-react';

// --- Object Type Icon Mapping ---

const OBJECT_ICONS: Record<string, React.ElementType> = {
    ENTITY: Database,
    CLAIM: FileText,
    RELATIONSHIP: GitBranch,
    MEMORY: Brain,
};

function getObjectIcon(objectType?: string) {
    const Icon = OBJECT_ICONS[objectType ?? ''] ?? Clock;
    return <Icon className="size-4" />;
}

function getObjectIconColor(objectType?: string) {
    switch (objectType) {
        case 'ENTITY':
            return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950';
        case 'CLAIM':
            return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950';
        case 'RELATIONSHIP':
            return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950';
        case 'MEMORY':
            return 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-950';
        default:
            return 'text-muted-foreground bg-muted';
    }
}

// --- Event Type Badge ---

function getEventBadgeVariant(eventType?: string) {
    switch (eventType) {
        case 'CREATED':
            return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
        case 'UPDATED':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
        case 'CONFLICT_DETECTED':
            return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
        case 'DELETED':
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        default:
            return 'bg-muted text-muted-foreground';
    }
}

function formatEventType(eventType?: string) {
    if (!eventType) return 'Unknown';
    return eventType
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Filter Options ---

const EVENT_TYPE_FILTERS = [
    { value: 'ALL', label: 'All Events' },
    { value: 'CREATED', label: 'Created' },
    { value: 'UPDATED', label: 'Updated' },
    { value: 'DELETED', label: 'Deleted' },
    { value: 'CONFLICT_DETECTED', label: 'Conflict Detected' },
];

// --- Timeline Entry Card ---

function TimelineEntryCard({
    event,
}: {
    event: Schemas['TimelineEventResponse'];
}) {
    const details = event.details as
        | Record<string, string | undefined>
        | undefined;

    return (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
            <div
                className={`mt-0.5 p-2 rounded-lg ${getObjectIconColor(event.objectType)}`}
            >
                {getObjectIcon(event.objectType)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${getEventBadgeVariant(event.eventType)}`}
                    >
                        {formatEventType(event.eventType)}
                    </span>
                    {event.objectType && (
                        <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0"
                        >
                            {event.objectType}
                        </Badge>
                    )}
                </div>
                {details?.description && (
                    <p className="text-sm text-foreground mt-1 line-clamp-2">
                        {details.description}
                    </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    {event.timestamp && (
                        <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {format(new Date(event.timestamp), 'h:mm a')}
                        </span>
                    )}
                    {event.actorName && <span>by {event.actorName}</span>}
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export function TimelinePage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [eventFilter, setEventFilter] = useState('ALL');

    const since = useMemo(
        () => subDays(new Date(), 30).toISOString(),
        [],
    );

    const { data: events, isLoading } = useQuery({
        ...workspaceChangesQueryOptions({
            workspaceId: selectedWorkspaceId ?? '',
            since,
        }),
        enabled: !!selectedWorkspaceId,
    });

    // Apply filter
    const filteredEvents = useMemo(() => {
        if (!events) return [];
        if (eventFilter === 'ALL') return events;
        return events.filter((e) => e.eventType === eventFilter);
    }, [events, eventFilter]);

    // Group by date
    const groupedEvents = useMemo(() => {
        const groups: Record<string, Schemas['TimelineEventResponse'][]> = {};
        for (const event of filteredEvents) {
            const dateKey = event.timestamp
                ? format(new Date(event.timestamp), 'MMMM d, yyyy')
                : 'Unknown Date';
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(event);
        }
        return groups;
    }, [filteredEvents]);

    const dateKeys = Object.keys(groupedEvents);

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Timeline' },
            ]}
        >
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Knowledge Evolution Timeline
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track how your knowledge base evolves over time.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Loading */}
                        {isLoading && (
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-muted/50 rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && dateKeys.length === 0 && (
                            <div className="text-center py-16 space-y-3">
                                <CalendarDays className="size-10 text-muted-foreground/50 mx-auto" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    No timeline events found
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    {eventFilter !== 'ALL'
                                        ? 'Try changing the event type filter.'
                                        : 'Events will appear here as your knowledge base evolves.'}
                                </p>
                            </div>
                        )}

                        {/* Grouped Timeline */}
                        {!isLoading && dateKeys.length > 0 && (
                            <div className="space-y-8">
                                {dateKeys.map((dateKey) => (
                                    <div key={dateKey}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <CalendarDays className="size-4 text-muted-foreground" />
                                            <h2 className="text-sm font-semibold text-foreground">
                                                {dateKey}
                                            </h2>
                                            <div className="flex-1 h-px bg-border" />
                                            <span className="text-xs text-muted-foreground">
                                                {groupedEvents[dateKey].length}{' '}
                                                {groupedEvents[dateKey].length ===
                                                1
                                                    ? 'event'
                                                    : 'events'}
                                            </span>
                                        </div>
                                        <div className="space-y-2 pl-7">
                                            {groupedEvents[dateKey].map(
                                                (event) => (
                                                    <TimelineEntryCard
                                                        key={event.id}
                                                        event={event}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Filter className="size-4" />
                                Filters
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                    Event Type
                                </label>
                                <select
                                    className="w-full bg-background border rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                                    value={eventFilter}
                                    onChange={(e) =>
                                        setEventFilter(e.target.value)
                                    }
                                >
                                    {EVENT_TYPE_FILTERS.map((f) => (
                                        <option key={f.value} value={f.value}>
                                            {f.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
