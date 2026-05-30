import {
    AlertTriangle,
    Link2,
    Mail,
    RefreshCw,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';

export interface NotificationEvent {
    key: string;
    label: string;
    description: string;
    icon: LucideIcon;
}

export const EVENT_TYPES: NotificationEvent[] = [
    {
        key: 'conflictAlerts',
        label: 'Conflict Detection',
        description: 'Get alerted when conflicting claims are detected.',
        icon: AlertTriangle,
    },
    {
        key: 'extractionAlerts',
        label: 'Entity Extraction',
        description: 'Notifications when new entities are extracted.',
        icon: Sparkles,
    },
    {
        key: 'syncAlerts',
        label: 'Integration Sync',
        description: 'Updates about integration sync completions.',
        icon: RefreshCw,
    },
    {
        key: 'aiAnswers',
        label: 'AI Suggestions',
        description: 'Surface AI-generated suggestions and answers.',
        icon: Sparkles,
    },
    {
        key: 'integrationEvents',
        label: 'Integration Events',
        description: 'Connections, disconnections, and auth issues.',
        icon: Link2,
    },
    {
        key: 'emailDigests',
        label: 'Weekly Digest',
        description: 'A weekly summary of workspace activity.',
        icon: Mail,
    },
];
