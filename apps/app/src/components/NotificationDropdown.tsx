import React from 'react';
import {
    AlertTriangle,
    Bell,
    CheckCheck,
    ExternalLink,
    RefreshCw,
    Settings,
    Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { $api } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@workspace/ui/components/popover';
import { useMarkAsRead } from '@/hooks/notifications/useMarkAsRead';
import { useMarkAllAsRead } from '@/hooks/notifications/useMarkAllAsRead';
import { EmptyState } from '@/pages/Settings/components/SectionStates';
import { Schemas } from '@/types/api';

function getNotificationIcon(type?: string) {
    switch (type) {
        case 'CONFLICT':
        case 'conflict':
            return <AlertTriangle className="size-4 text-amber-500" />;
        case 'ENTITY_EXTRACTION':
        case 'entity_extraction':
        case 'AI_SUGGESTION':
            return <Sparkles className="size-4 text-primary" />;
        case 'SYNC':
        case 'sync':
        case 'INTEGRATION':
            return <RefreshCw className="size-4 text-cyan-500" />;
        default:
            return <Bell className="size-4 text-muted-foreground" />;
    }
}

function NotificationItem({
    notification,
    onRead,
}: {
    notification: Schemas['NotificationResponse'];
    onRead: (id: string) => void;
}) {
    const handleClick = () => {
        if (notification.id && !notification.read) {
            onRead(notification.id);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                !notification.read ? 'bg-primary/5' : ''
            }`}
        >
            <div className="mt-0.5 shrink-0">
                {getNotificationIcon(notification.type)}
            </div>
            <div className="min-w-0 flex-1">
                <p
                    className={`text-sm leading-snug ${
                        !notification.read
                            ? 'font-medium'
                            : 'text-muted-foreground'
                    }`}
                >
                    {notification.title ?? notification.message}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                    {notification.createdAt
                        ? formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                          })
                        : ''}
                </p>
            </div>
            {!notification.read && (
                <div className="mt-2 shrink-0">
                    <div className="size-2 rounded-full bg-primary" />
                </div>
            )}
        </button>
    );
}

export function NotificationDropdown() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const { data: unreadNotifications } = $api.useQuery(
        'get',
        '/notifications/unread',
    );
    const { data: unreadCount } = $api.useQuery(
        'get',
        '/notifications/unread/count',
    );

    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();

    const count = unreadCount?.count ?? 0;
    const items: Schemas['NotificationResponse'][] =
        unreadNotifications?.slice(0, 8) ?? [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="relative rounded-lg p-2 transition-colors hover:bg-muted"
                >
                    <Bell className="size-5 text-muted-foreground" />
                    {count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                            {count > 9 ? '9+' : count}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[380px] overflow-hidden rounded-xl p-0"
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <div className="flex items-center gap-1">
                        {count > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground"
                                onClick={() => markAllAsRead.mutate({})}
                            >
                                <CheckCheck className="mr-1 size-3.5" />
                                Mark all as read
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => {
                                setOpen(false);
                                navigate('/settings/notifications');
                            }}
                            aria-label="Notification settings"
                        >
                            <Settings className="size-3.5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                <div className="max-h-[400px] divide-y divide-border overflow-y-auto">
                    {items.length === 0 ? (
                        <EmptyState
                            icon={Bell}
                            title="No new notifications"
                        />
                    ) : (
                        items.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={(id) =>
                                    markAsRead.mutate({
                                        params: { path: { id } },
                                    })
                                }
                            />
                        ))
                    )}
                </div>

                <div className="border-t px-4 py-2">
                    <Button
                        variant="ghost"
                        className="h-8 w-full text-xs text-muted-foreground"
                        onClick={() => {
                            setOpen(false);
                            navigate('/notifications');
                        }}
                    >
                        View all notifications
                        <ExternalLink className="ml-1 size-3" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
