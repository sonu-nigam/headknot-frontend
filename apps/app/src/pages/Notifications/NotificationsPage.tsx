import AppLayout from '@/components/AppLayout';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import { NotificationList } from './NotificationList';
import { NotificationPreferences } from './NotificationPreferences';

export function NotificationsPage() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Notifications' },
            ]}
        >
            <div className="flex flex-col items-center h-full mt-20">
                <Tabs defaultValue="all" className="w-[600px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="all">Notifications</TabsTrigger>
                        <TabsTrigger value="preferences">
                            Preferences
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                        <NotificationList />
                    </TabsContent>
                    <TabsContent value="preferences">
                        <NotificationPreferences />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
