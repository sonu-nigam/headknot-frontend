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
import {
    Sun,
    Moon,
    Monitor,
    Bell,
    Mail,
    AlertTriangle,
    Sparkles,
    RefreshCw,
    Search,
    HardDrive,
    Loader2,
} from 'lucide-react';
import React from 'react';

export function Settings() {
    const { selectedWorkspaceId } = useAppStore();
    const { theme, setTheme } = useTheme();

    const { data: userSettings, isLoading: userLoading } = useQuery(
        userSettingsQueryOptions,
    );

    const updateUserPrefs = useUpdateUserPreferences();

    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [conflictAlerts, setConflictAlerts] = React.useState(true);
    const [extractionAlerts, setExtractionAlerts] = React.useState(true);
    const [syncAlerts, setSyncAlerts] = React.useState(false);
    const [aiAnswers, setAiAnswers] = React.useState(true);

    React.useEffect(() => {
        if (userSettings?.preferences) {
            const prefs = userSettings.preferences as Record<string, unknown>;
            setEmailNotifications(Boolean(prefs.emailNotifications ?? true));
            setConflictAlerts(Boolean(prefs.conflictAlerts ?? true));
            setExtractionAlerts(Boolean(prefs.extractionAlerts ?? true));
            setSyncAlerts(Boolean(prefs.syncAlerts ?? false));
            setAiAnswers(Boolean(prefs.aiAnswers ?? true));
        }
    }, [userSettings]);

    const handleSave = () => {
        updateUserPrefs.mutate({
            preferences: {
                emailNotifications,
                conflictAlerts,
                extractionAlerts,
                syncAlerts,
                aiAnswers,
                theme,
            } as Record<string, unknown>,
        });
    };

    if (userLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                    <CardDescription>
                        Choose how Headknot looks for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        {[
                            {
                                value: 'dark' as const,
                                label: 'Dark',
                                icon: Moon,
                            },
                            {
                                value: 'light' as const,
                                label: 'Light',
                                icon: Sun,
                            },
                            {
                                value: 'system' as const,
                                label: 'System',
                                icon: Monitor,
                            },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setTheme(opt.value)}
                                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all ${
                                    theme === opt.value
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-muted-foreground/30'
                                }`}
                            >
                                <opt.icon
                                    className={`size-5 ${theme === opt.value ? 'text-primary' : 'text-muted-foreground'}`}
                                />
                                <span
                                    className={`text-xs font-medium ${theme === opt.value ? 'text-primary' : 'text-muted-foreground'}`}
                                >
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Search Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Search</CardTitle>
                    <CardDescription>
                        Configure search behavior and AI features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <Sparkles className="size-5 text-primary mt-0.5" />
                            <div>
                                <Label htmlFor="ai-answers">
                                    AI-Generated Answers
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Leverage entity extraction to synthesize
                                    search results.
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="ai-answers"
                            checked={aiAnswers}
                            onCheckedChange={setAiAnswers}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Notifications</CardTitle>
                    <CardDescription>
                        Choose what notifications you receive.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        {
                            id: 'email-notif',
                            icon: Mail,
                            label: 'Email Notifications',
                            desc: 'Receive email updates for important events.',
                            checked: emailNotifications,
                            onChange: setEmailNotifications,
                        },
                        {
                            id: 'conflict-alerts',
                            icon: AlertTriangle,
                            label: 'Conflict Detection',
                            desc: 'Get alerted when conflicting claims are detected.',
                            checked: conflictAlerts,
                            onChange: setConflictAlerts,
                        },
                        {
                            id: 'extraction-alerts',
                            icon: Sparkles,
                            label: 'Entity Extraction',
                            desc: 'Notifications when new entities are extracted.',
                            checked: extractionAlerts,
                            onChange: setExtractionAlerts,
                        },
                        {
                            id: 'sync-alerts',
                            icon: RefreshCw,
                            label: 'Integration Sync Status',
                            desc: 'Updates about integration sync completions.',
                            checked: syncAlerts,
                            onChange: setSyncAlerts,
                        },
                    ].map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-start gap-3">
                                <item.icon className="size-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <Label htmlFor={item.id}>
                                        {item.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id={item.id}
                                checked={item.checked}
                                onCheckedChange={item.onChange}
                            />
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSave}
                        disabled={updateUserPrefs.isPending}
                    >
                        {updateUserPrefs.isPending
                            ? 'Saving...'
                            : 'Save Preferences'}
                    </Button>
                </CardFooter>
            </Card>

            {/* System Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Search className="size-4" />
                            <span>Indexing Status</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
                            <span className="size-1.5 rounded-full bg-green-500" />
                            Active
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <HardDrive className="size-4" />
                            <span>Storage</span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                            1.2 GB / 5.0 GB
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
