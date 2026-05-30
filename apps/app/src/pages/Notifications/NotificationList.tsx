import React from 'react';
import { Bell, CheckCheckIcon, CheckIcon, Trash2Icon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { $api } from '@workspace/api-client';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { useDeleteNotification } from '@/hooks/notifications/useDeleteNotification';
import { useMarkAllAsRead } from '@/hooks/notifications/useMarkAllAsRead';
import { useMarkAsRead } from '@/hooks/notifications/useMarkAsRead';
import type { Schemas } from '@/types/api';
import {
    EmptyState,
    SectionError,
    SectionSkeleton,
} from '@/pages/Settings/components/SectionStates';

const PAGE_SIZE = 20;

export function NotificationList() {
    const [pages, setPages] = React.useState(1);
    const limit = pages * PAGE_SIZE;

    const {
        data: notifications,
        isLoading,
        isError,
        refetch,
    } = $api.useQuery('get', '/notifications', {
        params: { query: { limit, offset: 0 } },
    });
    const { data: unreadCount } = $api.useQuery(
        'get',
        '/notifications/unread/count',
    );

    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();
    const deleteNotification = useDeleteNotification();

    if (isLoading) return <SectionSkeleton rows={5} />;
    if (isError) {
        return (
            <SectionError
                message="Couldn't load notifications."
                onRetry={() => refetch()}
            />
        );
    }

    const hasMore = (notifications?.length ?? 0) >= limit;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Notifications
                            {(unreadCount?.count ?? 0) > 0 && (
                                <Badge>{unreadCount?.count} unread</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Stay updated with your latest activity.
                        </CardDescription>
                    </div>
                    {(unreadCount?.count ?? 0) > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAllAsRead.mutate({})}
                            disabled={markAllAsRead.isPending}
                        >
                            <CheckCheckIcon className="mr-1 size-4" />
                            Mark all read
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!notifications?.length ? (
                    <EmptyState
                        icon={Bell}
                        title="No notifications yet"
                        description="You're all caught up."
                    />
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notification: Schemas['NotificationResponse']) => (
                            <div
                                key={notification.id}
                                className={`flex items-start justify-between gap-3 rounded-md p-3 transition-colors ${
                                    !notification.read
                                        ? 'bg-muted/50'
                                        : 'hover:bg-muted/30'
                                }`}
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        {!notification.read && (
                                            <span className="size-2 shrink-0 rounded-full bg-primary" />
                                        )}
                                        <p className="truncate text-sm font-medium">
                                            {notification.title}
                                        </p>
                                    </div>
                                    {notification.message && (
                                        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                            {notification.message}
                                        </p>
                                    )}
                                    {notification.createdAt && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {formatDistanceToNow(
                                                new Date(notification.createdAt),
                                                { addSuffix: true },
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    {!notification.read && notification.id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() =>
                                                markAsRead.mutate({
                                                    params: {
                                                        path: {
                                                            id: notification.id!,
                                                        },
                                                    },
                                                })
                                            }
                                            title="Mark as read"
                                        >
                                            <CheckIcon className="size-4" />
                                        </Button>
                                    )}
                                    {notification.id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-muted-foreground hover:text-destructive"
                                            onClick={() =>
                                                deleteNotification.mutate({
                                                    params: {
                                                        path: {
                                                            id: notification.id!,
                                                        },
                                                    },
                                                })
                                            }
                                            title="Delete"
                                        >
                                            <Trash2Icon className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {hasMore && (
                            <div className="flex justify-center pt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPages((p) => p + 1)}
                                >
                                    Load more
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
