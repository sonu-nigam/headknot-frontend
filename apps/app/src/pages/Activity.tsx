import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Schemas } from '@/types/api';
import { activityListQueryOptions } from '@/query/options/activity';
import {
    formatDistanceToNow,
    isToday,
    isYesterday,
    subDays,
    isAfter,
} from 'date-fns';
import {
    RefreshCw,
    FileText,
    Folder,
    Box,
    User,
    Activity as ActivityIcon,
    Inbox,
    BarChart3,
} from 'lucide-react';

// --- Activity Icon & Color Mapping ---

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
    MEMORY_CREATED: FileText,
    MEMORY_UPDATED: FileText,
    SPACE_CREATED: Folder,
    WORKSPACE_CREATED: Box,
    MEMBER_ADDED: User,
    MEMBER_REMOVED: User,
};

const ACTIVITY_COLORS: Record<string, string> = {
    MEMORY_CREATED:
        'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950',
    MEMORY_UPDATED:
        'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950',
    SPACE_CREATED:
        'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950',
    WORKSPACE_CREATED:
        'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950',
    MEMBER_ADDED:
        'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-950',
    MEMBER_REMOVED:
        'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950',
};

function getActivityIcon(activityType?: string) {
    const Icon = ACTIVITY_ICONS[activityType ?? ''] ?? ActivityIcon;
    return <Icon className="size-4" />;
}

function getActivityColor(activityType?: string) {
    return ACTIVITY_COLORS[activityType ?? ''] ?? 'text-muted-foreground bg-muted';
}

function formatActivityType(activityType?: string) {
    if (!activityType) return 'Activity';
    return activityType
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Date Range Filter ---

const DATE_RANGE_FILTERS = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
];

function filterByDateRange(
    activities: Schemas['ActivityLogResponse'][],
    range: string,
) {
    const now = new Date();
    return activities.filter((a) => {
        if (!a.occurredAt) return false;
        const date = new Date(a.occurredAt);
        switch (range) {
            case 'today':
                return isToday(date);
            case 'yesterday':
                return isYesterday(date);
            case 'last7':
                return isAfter(date, subDays(now, 7));
            case 'last30':
                return isAfter(date, subDays(now, 30));
            default:
                return true;
        }
    });
}

// --- Activity Type Filter ---

const ACTIVITY_TYPE_FILTERS = [
    { value: 'ALL', label: 'All Activities' },
    { value: 'MEMORY_CREATED', label: 'Memory Created' },
    { value: 'MEMORY_UPDATED', label: 'Memory Updated' },
    { value: 'SPACE_CREATED', label: 'Space Created' },
    { value: 'WORKSPACE_CREATED', label: 'Workspace Created' },
    { value: 'MEMBER_ADDED', label: 'Member Added' },
    { value: 'MEMBER_REMOVED', label: 'Member Removed' },
];

// --- Activity Item ---

function ActivityItem({
    activity,
}: {
    activity: Schemas['ActivityLogResponse'];
}) {
    return (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
            <div
                className={`mt-0.5 p-2 rounded-lg ${getActivityColor(activity.activityType)}`}
            >
                {getActivityIcon(activity.activityType)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm leading-tight">
                    {activity.description || activity.activityType}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                    {activity.occurredAt && (
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.occurredAt), {
                                addSuffix: true,
                            })}
                        </span>
                    )}
                    {activity.activityType && (
                        <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0"
                        >
                            {formatActivityType(activity.activityType)}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export default function Activity() {
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [dateRange, setDateRange] = useState('last30');
    const [displayLimit, setDisplayLimit] = useState(50);

    const {
        data: activities,
        isLoading,
        refetch,
        isFetching,
    } = useQuery(activityListQueryOptions({ offset: 0, limit: displayLimit }));

    // Apply filters
    const filteredActivities = useMemo(() => {
        if (!activities) return [];
        let result = activities;

        // Type filter
        if (typeFilter !== 'ALL') {
            result = result.filter((a) => a.activityType === typeFilter);
        }

        // Date range filter
        result = filterByDateRange(result, dateRange);

        return result;
    }, [activities, typeFilter, dateRange]);

    // Analytics
    const eventsToday = useMemo(() => {
        if (!activities) return 0;
        return activities.filter(
            (a) => a.occurredAt && isToday(new Date(a.occurredAt)),
        ).length;
    }, [activities]);

    const eventsThisWeek = useMemo(() => {
        if (!activities) return 0;
        const weekAgo = subDays(new Date(), 7);
        return activities.filter(
            (a) =>
                a.occurredAt && isAfter(new Date(a.occurredAt), weekAgo),
        ).length;
    }, [activities]);

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Activity' },
            ]}
        >
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Activity Feed
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Recent activity across your workspaces.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2 self-start md:self-auto"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        <RefreshCw
                            className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Filters */}
                        <div className="flex items-center gap-3 mb-4">
                            <select
                                className="bg-background border rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                {ACTIVITY_TYPE_FILTERS.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="bg-background border rounded-lg text-xs font-medium py-2 px-3 pr-8 focus:ring-1 focus:ring-ring"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                {DATE_RANGE_FILTERS.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                        {!isLoading && filteredActivities.length === 0 && (
                            <div className="text-center py-16 space-y-3">
                                <Inbox className="size-10 text-muted-foreground/50 mx-auto" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    No activity found
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Try adjusting your filters or check back
                                    later.
                                </p>
                            </div>
                        )}

                        {/* Activity List */}
                        {!isLoading && filteredActivities.length > 0 && (
                            <div className="space-y-2">
                                {filteredActivities.map((activity) => (
                                    <ActivityItem
                                        key={activity.id}
                                        activity={activity}
                                    />
                                ))}
                                {activities &&
                                    activities.length >= displayLimit && (
                                        <div className="pt-2 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDisplayLimit(
                                                        (prev) => prev + 50,
                                                    )
                                                }
                                            >
                                                Load more
                                            </Button>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <BarChart3 className="size-4" />
                                Analytics
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Events Today
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {eventsToday}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Events This Week
                                    </p>
                                    <p className="text-2xl font-bold mt-1">
                                        {eventsThisWeek}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
