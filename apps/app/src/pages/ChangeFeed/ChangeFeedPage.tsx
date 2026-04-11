import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Plus,
    Pencil,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Activity,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { Schemas } from '@/types/api';
import { $api } from '@workspace/api-client';
import { formatDistanceToNow, subDays } from 'date-fns';

// --- Event Icon & Color Mapping ---

const EVENT_ICONS: Record<string, React.ElementType> = {
    CREATED: Plus,
    UPDATED: Pencil,
    CONFLICT_DETECTED: AlertTriangle,
    RESOLVED: CheckCircle,
};

function getEventIcon(eventType?: string) {
    const Icon = EVENT_ICONS[eventType ?? ''] ?? Activity;
    return <Icon className="size-4" />;
}

function getEventColor(eventType?: string) {
    switch (eventType) {
        case 'CONFLICT_DETECTED':
            return 'text-destructive bg-destructive/10';
        case 'RESOLVED':
            return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950';
        case 'CREATED':
            return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950';
        case 'UPDATED':
            return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-950';
        default:
            return 'text-muted-foreground bg-muted';
    }
}

function getEventDescription(event: Schemas['TimelineEventResponse']): string {
    const objectLabel = event.objectType?.toLowerCase() ?? 'object';
    const shortId = event.objectId?.slice(0, 8) ?? '';

    switch (event.eventType) {
        case 'CREATED':
            return `New ${objectLabel} added (${shortId})`;
        case 'UPDATED':
            return `${objectLabel} updated (${shortId})`;
        case 'CONFLICT_DETECTED':
            return `Conflict detected on ${objectLabel} (${shortId})`;
        case 'RESOLVED':
            return `Conflict resolved for ${objectLabel} (${shortId})`;
        default:
            return `${event.eventType ?? 'Event'} on ${objectLabel} (${shortId})`;
    }
}

// --- Change Event Item ---

function ChangeEventItem({
    event,
}: {
    event: Schemas['TimelineEventResponse'];
}) {
    const details = event.details as
        | Record<string, string | undefined>
        | undefined;
    const detailDescription = details?.description;

    return (
        <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
            <div
                className={`mt-0.5 p-1.5 rounded-md ${getEventColor(event.eventType)}`}
            >
                {getEventIcon(event.eventType)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">
                    {getEventDescription(event)}
                </p>
                {event.actorName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                        by {event.actorName}
                    </p>
                )}
                {detailDescription && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {detailDescription}
                    </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                    {event.timestamp && (
                        <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(event.timestamp), {
                                addSuffix: true,
                            })}
                        </span>
                    )}
                    {event.objectType && (
                        <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0"
                        >
                            {event.objectType}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export function ChangeFeedPage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const [since, setSince] = useState(() =>
        subDays(new Date(), 7).toISOString(),
    );

    const {
        data: events,
        isLoading,
        refetch,
    } = $api.useQuery("get", "/timeline/changes", {
        params: { query: { workspaceId: selectedWorkspaceId ?? '', since } },
    }, { enabled: !!selectedWorkspaceId && !!since });

    const handleRangeChange = (days: number) => {
        setSince(subDays(new Date(), days).toISOString());
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Change Feed' },
            ]}
        >
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Change Feed
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Track knowledge evolution across your workspace.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="bg-card border rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                            defaultValue="7"
                            onChange={(e) =>
                                handleRangeChange(Number(e.target.value))
                            }
                        >
                            <option value="1">Last 24 hours</option>
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={() => refetch()}
                        >
                            <RefreshCw className="size-3.5" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="max-w-2xl">
                    {/* Loading */}
                    {isLoading && (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-14 bg-muted/50 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && (!events || events.length === 0) && (
                        <div className="text-center py-8 space-y-2">
                            <CheckCircle className="size-8 text-green-500 mx-auto" />
                            <p className="text-sm font-medium">
                                No changes detected
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Your knowledge base has been stable during this
                                period.
                            </p>
                        </div>
                    )}

                    {/* Feed */}
                    {!isLoading && events && events.length > 0 && (
                        <div className="space-y-1">
                            {events.map((event) => (
                                <ChangeEventItem
                                    key={event.id}
                                    event={event}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
