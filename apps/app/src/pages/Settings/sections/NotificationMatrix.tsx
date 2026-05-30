import { toast } from 'sonner';
import { Button } from '@workspace/ui/components/button';
import { Switch } from '@workspace/ui/components/switch';
import { cn } from '@workspace/ui/lib/utils';
import { useNotificationMatrix } from '@/hooks/notifications/useNotificationMatrix';
import { SettingsSection } from '../components/SettingsSection';
import { SectionError, SectionSkeleton } from '../components/SectionStates';
import { EVENT_TYPES } from './notificationCatalog';

export function NotificationMatrix() {
    const m = useNotificationMatrix();

    if (m.isLoading) return <SectionSkeleton rows={6} />;
    if (m.isError) {
        return (
            <SectionError
                message="Couldn't load notification preferences."
                onRetry={m.refetch}
            />
        );
    }

    const handleSave = async () => {
        try {
            await m.save();
            toast.success('Notification preferences saved');
        } catch (e) {
            toast.error(
                "Couldn't save notification preferences: " +
                    (e instanceof Error ? e.message : 'Unknown error'),
            );
        }
    };

    return (
        <>
            <SettingsSection
                title="Channels"
                description="Master switches for how notifications reach you. Turning a channel off mutes its column below."
            >
                <div className="space-y-3">
                    <ChannelRow
                        label="In-App"
                        description="Show notifications inside the app."
                        checked={m.channels.inAppEnabled}
                        onCheckedChange={(v) => m.setChannel('inAppEnabled', v)}
                    />
                    <ChannelRow
                        label="Email"
                        description="Send notifications to your email."
                        checked={m.channels.emailEnabled}
                        onCheckedChange={(v) =>
                            m.setChannel('emailEnabled', v)
                        }
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                title="By Event Type"
                description="Choose which events notify you on each channel."
                footer={
                    <Button
                        onClick={handleSave}
                        disabled={!m.dirty || m.isSaving}
                    >
                        {m.isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                }
            >
                <div className="space-y-1">
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Event</span>
                        <span className="w-12 text-center">In-App</span>
                        <span className="w-12 text-center">Email</span>
                    </div>
                    {EVENT_TYPES.map((evt) => {
                        const cell = m.matrix[evt.key] ?? {
                            inApp: false,
                            email: false,
                        };
                        const Icon = evt.icon;
                        return (
                            <div
                                key={evt.key}
                                className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-t py-3"
                            >
                                <div className="flex items-start gap-3">
                                    <Icon className="mt-0.5 size-4 text-muted-foreground" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">
                                            {evt.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {evt.description}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        'flex w-12 justify-center',
                                        !m.channels.inAppEnabled && 'opacity-40',
                                    )}
                                >
                                    <Switch
                                        checked={cell.inApp}
                                        disabled={!m.channels.inAppEnabled}
                                        onCheckedChange={(v) =>
                                            m.setCell(evt.key, 'inApp', v)
                                        }
                                    />
                                </div>
                                <div
                                    className={cn(
                                        'flex w-12 justify-center',
                                        !m.channels.emailEnabled && 'opacity-40',
                                    )}
                                >
                                    <Switch
                                        checked={cell.email}
                                        disabled={!m.channels.emailEnabled}
                                        onCheckedChange={(v) =>
                                            m.setCell(evt.key, 'email', v)
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SettingsSection>
        </>
    );
}

function ChannelRow({
    label,
    description,
    checked,
    onCheckedChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}
