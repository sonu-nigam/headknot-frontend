import AppLayout from '@/components/AppLayout';
import { ActivityFeed } from '@/components/ActivityFeed';

export default function Activity() {
    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Activity' },
            ]}
        >
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Activity
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Recent activity across your workspaces
                    </p>
                </div>
                <div className="max-w-2xl">
                    <ActivityFeed />
                </div>
            </div>
        </AppLayout>
    );
}
