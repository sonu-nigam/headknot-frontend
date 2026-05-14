import { useEffect, useMemo, useState } from 'react';
import { $api } from '@workspace/api-client';
import AppLayout from '@/components/AppLayout';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { Switch } from '@workspace/ui/components/switch';
import { Schemas } from '@/types/api';
import { useAppStore } from '@/state/store';
import { useGetActivityById } from '@/hooks/activity/useGetActivityById';
import {
    formatDistanceToNow,
    format,
    isToday,
    isYesterday,
    isAfter,
    subDays,
    startOfDay,
} from 'date-fns';
import {
    RefreshCw,
    FileText,
    Folder,
    Box,
    User,
    Activity as ActivityIcon,
    Inbox,
    Copy,
    Check,
    ChevronDown,
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

// --- Type Chip Groups ---

type ChipKey = 'ALL' | 'MEMORY' | 'SPACES' | 'MEMBERS' | 'WORKSPACES';

interface ChipGroup {
    key: ChipKey;
    label: string;
    icon: React.ElementType;
    types: string[];
}

const CHIP_GROUPS: ChipGroup[] = [
    { key: 'ALL', label: 'All', icon: ActivityIcon, types: [] },
    {
        key: 'MEMORY',
        label: 'Memory',
        icon: FileText,
        types: ['MEMORY_CREATED', 'MEMORY_UPDATED'],
    },
    { key: 'SPACES', label: 'Spaces', icon: Folder, types: ['SPACE_CREATED'] },
    {
        key: 'MEMBERS',
        label: 'Members',
        icon: User,
        types: ['MEMBER_ADDED', 'MEMBER_REMOVED'],
    },
    {
        key: 'WORKSPACES',
        label: 'Workspaces',
        icon: Box,
        types: ['WORKSPACE_CREATED'],
    },
];

function getChipGroup(key: ChipKey): ChipGroup {
    return CHIP_GROUPS.find((g) => g.key === key) ?? CHIP_GROUPS[0]!;
}

// --- Date Range ---

type DateRange = 'today' | 'yesterday' | 'last7' | 'last30';

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7', label: 'Last 7 days' },
    { value: 'last30', label: 'Last 30 days' },
];

function computeSinceUntil(range: DateRange): { since?: string; until?: string } {
    const now = new Date();
    switch (range) {
        case 'today':
            return { since: startOfDay(now).toISOString() };
        case 'yesterday':
            return {
                since: startOfDay(subDays(now, 1)).toISOString(),
                until: startOfDay(now).toISOString(),
            };
        case 'last7':
            return { since: subDays(now, 7).toISOString() };
        case 'last30':
            return { since: subDays(now, 30).toISOString() };
    }
}

// --- Day Bucketing ---

type Buckets = {
    today: Schemas['ActivityLogResponse'][];
    yesterday: Schemas['ActivityLogResponse'][];
    thisWeek: Schemas['ActivityLogResponse'][];
    earlier: Schemas['ActivityLogResponse'][];
};

function groupByBucket(
    activities: Schemas['ActivityLogResponse'][],
): Buckets {
    const buckets: Buckets = {
        today: [],
        yesterday: [],
        thisWeek: [],
        earlier: [],
    };
    const sevenDaysAgo = subDays(new Date(), 7);
    for (const a of activities) {
        if (!a.occurredAt) {
            buckets.earlier.push(a);
            continue;
        }
        const date = new Date(a.occurredAt);
        if (isToday(date)) buckets.today.push(a);
        else if (isYesterday(date)) buckets.yesterday.push(a);
        else if (isAfter(date, sevenDaysAgo)) buckets.thisWeek.push(a);
        else buckets.earlier.push(a);
    }
    return buckets;
}

// --- Main Page ---

export default function Activity() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const [chipKey, setChipKey] = useState<ChipKey>('ALL');
    const [dateRange, setDateRange] = useState<DateRange>('last30');
    const [displayLimit, setDisplayLimit] = useState(50);
    const [scopeToWorkspace, setScopeToWorkspace] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpanded = (id?: string) => {
        if (!id) return;
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const chip = getChipGroup(chipKey);

    // For multi-type chips (Memory, Members) we don't send `type` to the server
    // because the API only accepts a single value; we fall back to a tiny
    // client-side filter for that case.
    const serverType =
        chip.types.length === 1 ? chip.types[0] : undefined;

    // Memoize to keep the ISO timestamps stable across renders — otherwise
    // new Date() runs every render, the query key changes, and react-query
    // refetches in a tight loop.
    const sinceUntil = useMemo(() => computeSinceUntil(dateRange), [dateRange]);

    const workspaceIdForQuery =
        scopeToWorkspace && selectedWorkspaceId ? selectedWorkspaceId : undefined;

    const {
        data: activities,
        isLoading,
        refetch,
        isFetching,
    } = $api.useQuery('get', '/activity/', {
        params: {
            query: {
                offset: 0,
                limit: displayLimit,
                ...(workspaceIdForQuery ? { workspaceId: workspaceIdForQuery } : {}),
                ...(serverType ? { type: serverType } : {}),
                ...sinceUntil,
            },
        },
    });

    // Client-side filter only when the chip groups multiple raw types.
    const filteredActivities = useMemo(() => {
        if (!activities) return [];
        if (chip.types.length <= 1) return activities;
        const allowed = new Set(chip.types);
        return activities.filter(
            (a: Schemas['ActivityLogResponse']) =>
                a.activityType && allowed.has(a.activityType),
        );
    }, [activities, chip.types]);

    // Counts for chips, derived from the unfiltered loaded page.
    const chipCounts = useMemo(() => {
        const counts: Record<ChipKey, number> = {
            ALL: 0,
            MEMORY: 0,
            SPACES: 0,
            MEMBERS: 0,
            WORKSPACES: 0,
        };
        for (const a of activities ?? []) {
            counts.ALL += 1;
            for (const g of CHIP_GROUPS) {
                if (g.key === 'ALL') continue;
                if (a.activityType && g.types.includes(a.activityType)) {
                    counts[g.key] += 1;
                }
            }
        }
        return counts;
    }, [activities]);

    const buckets = useMemo(
        () => groupByBucket(filteredActivities),
        [filteredActivities],
    );

    const eventsToday = buckets.today.length;
    const eventsThisWeek =
        buckets.today.length + buckets.yesterday.length + buckets.thisWeek.length;

    const workspaceToggleDisabled = !selectedWorkspaceId;

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Activity' },
            ]}
        >
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4 max-w-5xl mx-auto w-full">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Activity
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLoading ? (
                            <span className="inline-block h-4 w-48 rounded bg-muted animate-pulse align-middle" />
                        ) : (
                            <>
                                <span className="font-medium text-foreground">
                                    {eventsToday}
                                </span>{' '}
                                today ·{' '}
                                <span className="font-medium text-foreground">
                                    {eventsThisWeek}
                                </span>{' '}
                                this week
                            </>
                        )}
                    </p>
                </div>

                {/* Type chips */}
                <TypeFilterChips
                    counts={chipCounts}
                    active={chipKey}
                    onChange={setChipKey}
                />

                {/* Filter row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 -mt-2">
                    <Select
                        value={dateRange}
                        onValueChange={(v) => setDateRange(v as DateRange)}
                    >
                        <SelectTrigger className="w-[170px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DATE_RANGE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <label
                        className={`flex items-center gap-2 text-xs ${workspaceToggleDisabled ? 'opacity-50' : ''}`}
                    >
                        <Switch
                            checked={
                                !workspaceToggleDisabled && scopeToWorkspace
                            }
                            disabled={workspaceToggleDisabled}
                            onCheckedChange={setScopeToWorkspace}
                        />
                        <span className="text-muted-foreground">
                            {scopeToWorkspace && !workspaceToggleDisabled
                                ? 'Current workspace'
                                : 'All workspaces'}
                        </span>
                    </label>

                    <div className="sm:ml-auto">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={() => refetch()}
                            disabled={isFetching}
                        >
                            <RefreshCw
                                className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`}
                            />
                            Refresh
                        </Button>
                    </div>
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
                    <div className="text-center py-12 space-y-2">
                        <Inbox className="size-8 text-muted-foreground/50 mx-auto" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No activity found
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Try widening the date range or switching filters.
                        </p>
                    </div>
                )}

                {/* Grouped list */}
                {!isLoading && filteredActivities.length > 0 && (
                    <div className="space-y-6">
                        <BucketSection
                            heading="Today"
                            items={buckets.today}
                            expandedId={expandedId}
                            onToggle={toggleExpanded}
                        />
                        <BucketSection
                            heading="Yesterday"
                            items={buckets.yesterday}
                            expandedId={expandedId}
                            onToggle={toggleExpanded}
                        />
                        <BucketSection
                            heading="This week"
                            items={buckets.thisWeek}
                            expandedId={expandedId}
                            onToggle={toggleExpanded}
                        />
                        <BucketSection
                            heading="Earlier"
                            items={buckets.earlier}
                            expandedId={expandedId}
                            onToggle={toggleExpanded}
                        />

                        {activities && activities.length >= displayLimit && (
                            <div className="pt-2 text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setDisplayLimit((prev) => prev + 50)
                                    }
                                >
                                    Load more
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// --- Type Filter Chips ---

function TypeFilterChips({
    counts,
    active,
    onChange,
}: {
    counts: Record<ChipKey, number>;
    active: ChipKey;
    onChange: (key: ChipKey) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {CHIP_GROUPS.map((g) => {
                const Icon = g.icon;
                const isActive = active === g.key;
                const count = counts[g.key];
                return (
                    <button
                        key={g.key}
                        onClick={() => onChange(g.key)}
                        className={
                            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
                            (isActive
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-card text-muted-foreground hover:bg-muted')
                        }
                    >
                        <Icon className="size-3.5" />
                        <span>{g.label}</span>
                        <span
                            className={
                                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold ' +
                                (isActive
                                    ? 'bg-primary-foreground/20'
                                    : 'bg-muted')
                            }
                        >
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

// --- Bucket Section ---

function BucketSection({
    heading,
    items,
    expandedId,
    onToggle,
}: {
    heading: string;
    items: Schemas['ActivityLogResponse'][];
    expandedId: string | null;
    onToggle: (id?: string) => void;
}) {
    if (items.length === 0) return null;
    return (
        <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {heading}
            </h2>
            <ul className="space-y-2">
                {items.map((activity) => {
                    const isExpanded =
                        !!activity.id && expandedId === activity.id;
                    return (
                        <li key={activity.id}>
                            <ActivityCard
                                activity={activity}
                                isExpanded={isExpanded}
                                onToggle={() => onToggle(activity.id)}
                            />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

// --- Activity Card (row + collapsible detail) ---

function ActivityCard({
    activity,
    isExpanded,
    onToggle,
}: {
    activity: Schemas['ActivityLogResponse'];
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <div
            className={
                'rounded-lg border bg-card transition-colors ' +
                (isExpanded
                    ? 'border-border'
                    : 'border-border/50 hover:bg-muted/40')
            }
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isExpanded}
                className="w-full text-left flex items-start gap-3 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            >
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
                                {formatDistanceToNow(
                                    new Date(activity.occurredAt),
                                    { addSuffix: true },
                                )}
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
                <ChevronDown
                    className={
                        'size-4 text-muted-foreground mt-2.5 shrink-0 transition-transform ' +
                        (isExpanded ? 'rotate-180' : '')
                    }
                />
            </button>
            {isExpanded && <ActivityDetail activity={activity} />}
        </div>
    );
}

// --- Inline detail panel ---

function ActivityDetail({
    activity,
}: {
    activity: Schemas['ActivityLogResponse'];
}) {
    const getDetail = useGetActivityById();
    const [detail, setDetail] = useState<Schemas['ActivityLogResponse']>(
        activity,
    );

    useEffect(() => {
        if (!activity.id) return;
        getDetail.mutate(
            { params: { path: { id: activity.id } } },
            {
                onSuccess: (data) =>
                    setDetail(data as Schemas['ActivityLogResponse']),
            },
        );
        // Hook reference is stable for the lifetime of this component, and
        // ActivityDetail only mounts when its row is expanded — so a single
        // fetch per expansion is exactly what we want.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity.id]);

    return (
        <div className="px-4 pb-4 pt-1 border-t border-border/60 space-y-4">
            {detail.occurredAt && (
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        Occurred
                    </p>
                    <p className="text-sm">
                        {format(
                            new Date(detail.occurredAt),
                            'MMM d, yyyy HH:mm:ss',
                        )}
                    </p>
                </div>
            )}

            <MetadataBlock metadata={detail.metadata} />

            <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    References
                </p>
                <CopyableId label="Activity ID" value={detail.id} />
                <CopyableId label="Workspace ID" value={detail.workspaceId} />
                <CopyableId label="Actor ID" value={detail.actorId} />
                <CopyableId label="Event ID" value={detail.eventId} />
            </div>
        </div>
    );
}

function MetadataBlock({
    metadata,
}: {
    metadata?: { [key: string]: Record<string, never> };
}) {
    const entries = Object.entries(metadata ?? {});
    if (entries.length === 0) return null;
    return (
        <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Metadata
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                {entries.map(([k, v]) => (
                    <div key={k} className="contents">
                        <dt className="text-muted-foreground capitalize">
                            {k}
                        </dt>
                        <dd className="font-mono break-all">
                            {typeof v === 'string' ? v : JSON.stringify(v)}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

function CopyableId({ label, value }: { label: string; value?: string }) {
    const [copied, setCopied] = useState(false);
    if (!value) return null;
    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground w-24 shrink-0">{label}</span>
            <code className="flex-1 font-mono truncate" title={value}>
                {value}
            </code>
            <button
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground"
                title="Copy"
            >
                {copied ? (
                    <Check className="size-3.5" />
                ) : (
                    <Copy className="size-3.5" />
                )}
            </button>
        </div>
    );
}
