import AppLayout from '@/components/AppLayout';
import { NotificationList } from './NotificationList';

export function NotificationsInboxPage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Notifications' },
            ]}
        >
            <div className="mx-auto w-full max-w-3xl space-y-6 p-6 md:p-8 pb-24">
                <NotificationList />
            </div>
        </AppLayout>
    );
}
