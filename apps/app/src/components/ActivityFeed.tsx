import { useQuery } from '@tanstack/react-query';
import { activityListQueryOptions } from '@/query/options/activity';
import { Schemas } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import {
    FileTextIcon,
    FolderIcon,
    BoxIcon,
    UserIcon,
    ActivityIcon,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useState } from 'react';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
    MEMORY_CREATED: FileTextIcon,
    MEMORY_UPDATED: FileTextIcon,
    SPACE_CREATED: FolderIcon,
    WORKSPACE_CREATED: BoxIcon,
    MEMBER_ADDED: UserIcon,
    MEMBER_REMOVED: UserIcon,
};

function getActivityIcon(activityType?: string) {
    const Icon = ACTIVITY_ICONS[activityType ?? ''] ?? ActivityIcon;
    return <Icon className="size-4" />;
}

interface ActivityFeedProps {
    limit?: number;
}

export function ActivityFeed({ limit = 20 }: ActivityFeedProps) {
    const [displayLimit, setDisplayLimit] = useState(limit);

    const { data: activities, isLoading } = useQuery(
        activityListQueryOptions({ offset: 0, limit: displayLimit }),
    );

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-14 bg-muted/50 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground text-sm">
                No activity yet
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
            {activities.length >= displayLimit && (
                <div className="pt-2 text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDisplayLimit((prev) => prev + 20)}
                    >
                        Load more
                    </Button>
                </div>
            )}
        </div>
    );
}

function ActivityItem({
    activity,
}: {
    activity: Schemas['ActivityLogResponse'];
}) {
    return (
        <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="mt-0.5 p-1.5 rounded-md bg-muted text-muted-foreground">
                {getActivityIcon(activity.activityType)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm leading-tight">
                    {activity.description || activity.activityType}
                </p>
                {activity.occurredAt && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(activity.occurredAt), {
                            addSuffix: true,
                        })}
                    </p>
                )}
            </div>
        </div>
    );
}
