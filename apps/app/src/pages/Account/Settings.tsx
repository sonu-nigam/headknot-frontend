import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/state/store';
import {
    userSettingsQueryOptions,
    workspaceSettingsQueryOptions,
} from '@/query/options/settings';
import { useUpdateUserPreferences } from '@/hooks/settings/useUpdateUserPreferences';
import { useUpdateWorkspaceSettings } from '@/hooks/settings/useUpdateWorkspaceSettings';
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
import { useTheme } from '@/components/ThemeProvider';
import React from 'react';

export function Settings() {
    const { selectedWorkspaceId } = useAppStore();
    const { theme, setTheme } = useTheme();

    const { data: userSettings, isLoading: userLoading } = useQuery(
        userSettingsQueryOptions
    );
    const { data: workspaceSettings, isLoading: wsLoading } = useQuery(
        workspaceSettingsQueryOptions(selectedWorkspaceId ?? '')
    );

    const updateUserPrefs = useUpdateUserPreferences();
    const updateWsSettings = useUpdateWorkspaceSettings();

    const [emailDigest, setEmailDigest] = React.useState(false);
    const [compactView, setCompactView] = React.useState(false);
    const [autoSave, setAutoSave] = React.useState(true);

    React.useEffect(() => {
        if (userSettings?.preferences) {
            const prefs = userSettings.preferences as Record<string, unknown>;
            setEmailDigest(Boolean(prefs.emailDigest ?? false));
            setCompactView(Boolean(prefs.compactView ?? false));
        }
    }, [userSettings]);

    React.useEffect(() => {
        if (workspaceSettings?.settings) {
            const ws = workspaceSettings.settings as Record<string, unknown>;
            setAutoSave(Boolean(ws.autoSave ?? true));
        }
    }, [workspaceSettings]);

    const handleSaveUserPrefs = () => {
        updateUserPrefs.mutate({
            preferences: {
                emailDigest,
                compactView,
                theme,
            } as Record<string, unknown>,
        });
    };

    const handleSaveWsSettings = () => {
        if (!selectedWorkspaceId) return;
        updateWsSettings.mutate({
            workspaceId: selectedWorkspaceId,
            body: {
                settings: {
                    autoSave,
                } as Record<string, unknown>,
            },
        });
    };

    if (userLoading || wsLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    Loading settings...
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how the app looks and feels.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Use dark theme across the application.
                            </p>
                        </div>
                        <Switch
                            id="dark-mode"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) =>
                                setTheme(checked ? 'dark' : 'light')
                            }
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="compact-view">Compact View</Label>
                            <p className="text-sm text-muted-foreground">
                                Reduce spacing for a denser layout.
                            </p>
                        </div>
                        <Switch
                            id="compact-view"
                            checked={compactView}
                            onCheckedChange={setCompactView}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>
                        Manage your personal preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="email-digest">Email Digest</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive a daily summary email of activity.
                            </p>
                        </div>
                        <Switch
                            id="email-digest"
                            checked={emailDigest}
                            onCheckedChange={setEmailDigest}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSaveUserPrefs}
                        disabled={updateUserPrefs.isPending}
                    >
                        {updateUserPrefs.isPending
                            ? 'Saving...'
                            : 'Save Preferences'}
                    </Button>
                </CardFooter>
            </Card>

            {selectedWorkspaceId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Workspace Settings</CardTitle>
                        <CardDescription>
                            Settings specific to your current workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="auto-save">Auto Save</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically save changes as you type.
                                </p>
                            </div>
                            <Switch
                                id="auto-save"
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSaveWsSettings}
                            disabled={updateWsSettings.isPending}
                        >
                            {updateWsSettings.isPending
                                ? 'Saving...'
                                : 'Save Workspace Settings'}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
