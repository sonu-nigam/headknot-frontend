import { $api } from '@workspace/api-client';
import { useMarkAsRead } from '@/hooks/notifications/useMarkAsRead';
import { useMarkAllAsRead } from '@/hooks/notifications/useMarkAllAsRead';
import { useDeleteNotification } from '@/hooks/notifications/useDeleteNotification';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { CheckIcon, Trash2Icon, CheckCheckIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function NotificationList() {
    const { data: notifications, isLoading } = $api.useQuery("get", "/notifications", {
        params: { query: { limit: 20, offset: 0 } },
    });
    const { data: unreadCount } = $api.useQuery("get", "/notifications/unread/count");
    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();
    const deleteNotification = useDeleteNotification();

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    Loading notifications...
                </CardContent>
            </Card>
        );
    }

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
                            <CheckCheckIcon className="h-4 w-4 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!notifications?.length ? (
                    <p className="text-center text-muted-foreground py-8">
                        No notifications yet.
                    </p>
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex items-start justify-between gap-3 p-3 rounded-md transition-colors ${
                                    !notification.read
                                        ? 'bg-muted/50'
                                        : 'hover:bg-muted/30'
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        {!notification.read && (
                                            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                        )}
                                        <p className="font-medium text-sm truncate">
                                            {notification.title}
                                        </p>
                                    </div>
                                    {notification.message && (
                                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                            {notification.message}
                                        </p>
                                    )}
                                    {notification.createdAt && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.createdAt
                                                ),
                                                { addSuffix: true }
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {!notification.read && notification.id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                                markAsRead.mutate({
                                                    params: { path: { id: notification.id! } },
                                                })
                                            }
                                            title="Mark as read"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {notification.id && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() =>
                                                deleteNotification.mutate({
                                                    params: { path: { id: notification.id! } },
                                                })
                                            }
                                            title="Delete"
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
