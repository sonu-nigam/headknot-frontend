import { useQuery } from '@tanstack/react-query';
import { notificationPreferencesQueryOptions } from '@/query/options/notifications';
import { useUpdateNotificationPreferences } from '@/hooks/notifications/useUpdateNotificationPreferences';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import React from 'react';

export function NotificationPreferences() {
    const { data: preferences, isLoading } = useQuery(
        notificationPreferencesQueryOptions
    );
    const updatePrefs = useUpdateNotificationPreferences();

    const [inAppEnabled, setInAppEnabled] = React.useState(true);
    const [emailEnabled, setEmailEnabled] = React.useState(true);

    React.useEffect(() => {
        if (preferences) {
            setInAppEnabled(preferences.inAppEnabled ?? true);
            setEmailEnabled(preferences.emailEnabled ?? true);
        }
    }, [preferences]);

    const handleSave = () => {
        updatePrefs.mutate({
            inAppEnabled,
            emailEnabled,
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    Loading preferences...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                    Choose how you want to be notified.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="in-app">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                            Show notifications within the application.
                        </p>
                    </div>
                    <Switch
                        id="in-app"
                        checked={inAppEnabled}
                        onCheckedChange={setInAppEnabled}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="email">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                            Receive notifications via email.
                        </p>
                    </div>
                    <Switch
                        id="email"
                        checked={emailEnabled}
                        onCheckedChange={setEmailEnabled}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSave}
                    disabled={updatePrefs.isPending}
                >
                    {updatePrefs.isPending ? 'Saving...' : 'Save Preferences'}
                </Button>
            </CardFooter>
        </Card>
    );
}
