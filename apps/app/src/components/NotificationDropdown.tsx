import { useQuery } from '@tanstack/react-query';
import {
    unreadNotificationsQueryOptions,
    unreadCountQueryOptions,
} from '@/query/options/notifications';
import { useMarkAsRead } from '@/hooks/notifications/useMarkAsRead';
import { useMarkAllAsRead } from '@/hooks/notifications/useMarkAllAsRead';
import { Button } from '@workspace/ui/components/button';
import {
    Bell,
    AlertTriangle,
    Sparkles,
    RefreshCw,
    Link2,
    CheckCheck,
    Settings,
    ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Schemas } from '@/types/api';
import React from 'react';

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
    const navigate = useNavigate();

    const handleClick = () => {
        if (notification.id && !notification.read) {
            onRead(notification.id);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                !notification.read ? 'bg-primary/5' : ''
            }`}
        >
            <div className="shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm leading-snug ${!notification.read ? 'font-medium' : 'text-muted-foreground'}`}
                >
                    {notification.title ?? notification.message}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                    {notification.createdAt
                        ? formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                          )
                        : ''}
                </p>
            </div>
            {!notification.read && (
                <div className="shrink-0 mt-2">
                    <div className="size-2 rounded-full bg-primary" />
                </div>
            )}
        </button>
    );
}

export function NotificationDropdown() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const { data: unreadNotifications } = useQuery(
        unreadNotificationsQueryOptions,
    );
    const { data: unreadCount } = useQuery(unreadCountQueryOptions);

    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();

    const count = unreadCount?.count ?? 0;

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
                <Bell className="size-5 text-muted-foreground" />
                {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-[380px] bg-card border rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h3 className="text-sm font-semibold">
                            Notifications
                        </h3>
                        <div className="flex items-center gap-1">
                            {count > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-muted-foreground"
                                    onClick={() => markAllAsRead.mutate()}
                                >
                                    <CheckCheck className="size-3.5 mr-1" />
                                    Mark all as read
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => {
                                    setOpen(false);
                                    navigate('/notifications');
                                }}
                            >
                                <Settings className="size-3.5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
                        {(!unreadNotifications ||
                            unreadNotifications.length === 0) && (
                            <div className="px-4 py-8 text-center">
                                <Bell className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    No new notifications
                                </p>
                            </div>
                        )}
                        {unreadNotifications?.slice(0, 8).map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={(id) => markAsRead.mutate({ id })}
                            />
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t px-4 py-2">
                        <Button
                            variant="ghost"
                            className="w-full h-8 text-xs text-muted-foreground"
                            onClick={() => {
                                setOpen(false);
                                navigate('/notifications');
                            }}
                        >
                            View all notifications
                            <ExternalLink className="size-3 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
