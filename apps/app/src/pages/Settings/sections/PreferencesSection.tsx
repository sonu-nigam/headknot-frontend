import React from 'react';
import { Monitor, Moon, Sparkles, Sun } from 'lucide-react';
import { $api } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { cn } from '@workspace/ui/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { useUpdateUserPreferences } from '@/hooks/settings/useUpdateUserPreferences';
import { useToastedMutation } from '@/hooks/useToastedMutation';
import { SettingsSection } from '../components/SettingsSection';
import { SectionError, SectionSkeleton } from '../components/SectionStates';

const THEME_OPTIONS = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
] as const;

export function PreferencesSection() {
    const {
        data: userSettings,
        isLoading,
        isError,
        refetch,
    } = $api.useQuery('get', '/settings/user');

    if (isLoading) return <SectionSkeleton rows={4} />;
    if (isError) {
        return (
            <SectionError
                message="Couldn't load your preferences."
                onRetry={() => refetch()}
            />
        );
    }

    const prefs = (userSettings?.preferences ?? {}) as Record<string, unknown>;

    return (
        <>
            <AppearanceCard prefs={prefs} />
            <SearchCard prefs={prefs} />
        </>
    );
}

function AppearanceCard({ prefs }: { prefs: Record<string, unknown> }) {
    const { theme, setTheme } = useTheme();
    const updatePrefs = $api.useMutation('put', '/settings/user', {
        ...useToastedMutation({
            success: 'Theme updated',
            error: "Couldn't save theme",
        }),
    });

    const handleThemeChange = (value: 'dark' | 'light' | 'system') => {
        setTheme(value);
        updatePrefs.mutate({
            body: { preferences: { ...prefs, theme: value } },
        });
    };

    return (
        <SettingsSection
            title="Appearance"
            description="Choose how Headknot looks for you."
        >
            <div className="flex gap-3">
                {THEME_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = theme === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleThemeChange(opt.value)}
                            className={cn(
                                'flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 transition-all',
                                selected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-muted-foreground/30',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'size-5',
                                    selected
                                        ? 'text-primary'
                                        : 'text-muted-foreground',
                                )}
                            />
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    selected
                                        ? 'text-primary'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {opt.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </SettingsSection>
    );
}

function SearchCard({ prefs }: { prefs: Record<string, unknown> }) {
    const [aiAnswers, setAiAnswers] = React.useState(
        Boolean(prefs.aiAnswers ?? true),
    );
    const updatePrefs = useUpdateUserPreferences();
    const toasts = useToastedMutation({
        success: 'Search preferences saved',
        error: "Couldn't save search preferences",
    });

    const handleSave = () => {
        updatePrefs.mutate(
            { body: { preferences: { ...prefs, aiAnswers } } },
            toasts,
        );
    };

    const dirty = aiAnswers !== Boolean(prefs.aiAnswers ?? true);

    return (
        <SettingsSection
            title="Search"
            description="Configure search behavior and AI features."
            footer={
                <Button
                    onClick={handleSave}
                    disabled={!dirty || updatePrefs.isPending}
                >
                    {updatePrefs.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            }
        >
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-5 text-primary" />
                    <div>
                        <Label htmlFor="ai-answers">AI-Generated Answers</Label>
                        <p className="text-sm text-muted-foreground">
                            Leverage entity extraction to synthesize search
                            results.
                        </p>
                    </div>
                </div>
                <Switch
                    id="ai-answers"
                    checked={aiAnswers}
                    onCheckedChange={setAiAnswers}
                />
            </div>
        </SettingsSection>
    );
}
