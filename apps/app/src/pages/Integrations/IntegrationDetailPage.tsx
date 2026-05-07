import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui/components/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import {
    HardDrive,
    MessageSquare,
    FileText,
    Code,
    BookOpen,
    CheckCircle,
    Loader2,
    PlugZap,
    RefreshCw,
    AlertTriangle,
    Database,
    Clock,
    AlertCircle,
    FolderOpen,
} from 'lucide-react';
import { $api } from '@workspace/api-client';
import { useDisconnectIntegration } from '@/hooks/integrations/useDisconnectIntegration';
import { useTriggerSync } from '@/hooks/integrations/useTriggerSync';
import { formatDistanceToNow, format } from 'date-fns';
import { SlackChannelsTab } from './SlackChannelsTab';
import { GoogleDriveFilesTab } from './GoogleDriveFilesTab';
import { GoogleDrivePickerDialog } from './GoogleDrivePickerDialog';

// --- Provider icon mapping ---

const PROVIDER_ICONS: Record<string, React.ReactNode> = {
    GOOGLE_DRIVE: <HardDrive className="size-7" />,
    SLACK: <MessageSquare className="size-7" />,
    NOTION: <FileText className="size-7" />,
    GITHUB: <Code className="size-7" />,
    JIRA: <CheckCircle className="size-7" />,
    CONFLUENCE: <BookOpen className="size-7" />,
};

function getProviderIcon(type?: string) {
    return PROVIDER_ICONS[type ?? ''] ?? <PlugZap className="size-7" />;
}

// --- Status Badge ---

function StatusBadge({ status }: { status?: string }) {
    const s = (status ?? '').toUpperCase();
    if (s === 'CONNECTED') {
        return (
            <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Connected
            </Badge>
        );
    }
    if (s === 'SYNCING') {
        return (
            <Badge
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                Syncing
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="text-muted-foreground">
            Disconnected
        </Badge>
    );
}

// --- Helpers ---

function formatRelative(dateStr?: string) {
    if (!dateStr) return 'Never';
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

function formatDuration(startedAt?: string, completedAt?: string) {
    if (!startedAt || !completedAt) return '--';
    const ms =
        new Date(completedAt).getTime() - new Date(startedAt).getTime();
    if (ms < 1000) return `${ms}ms`;
    const secs = Math.round(ms / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
}

// --- Main Page ---

export function IntegrationDetailPage() {
    const { integrationId } = useParams<{ integrationId: string }>();
    const navigate = useNavigate();

    const { data: integration, isLoading } = $api.useQuery("get", "/integrations/{integrationId}", {
        params: { path: { integrationId: integrationId ?? '' } },
    }, { enabled: !!integrationId });

    const { data: syncStatus, isLoading: syncLoading } = $api.useQuery("get", "/integrations/{id}/sync-stats", {
        params: { path: { id: integrationId ?? '' } },
    }, { enabled: !!integrationId });

    const disconnectMutation = useDisconnectIntegration();
    const syncMutation = useTriggerSync();
    const [pickerOpen, setPickerOpen] = useState(false);

    const handleDisconnect = () => {
        if (!integrationId) return;
        disconnectMutation.mutate(
            { params: { path: { id: integrationId } } },
            {
                onSuccess: () => navigate('/integrations'),
            },
        );
    };

    const handleSync = () => {
        if (!integrationId) return;
        syncMutation.mutate({ params: { path: { id: integrationId } } });
    };

    // Loading state
    if (isLoading) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Integrations', href: '/integrations' },
                    { label: 'Loading...' },
                ]}
            >
                <div className="flex items-center justify-center flex-1">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    // Not found
    if (!integration) {
        return (
            <AppLayout
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Integrations', href: '/integrations' },
                    { label: 'Not Found' },
                ]}
            >
                <div className="flex items-center justify-center flex-1">
                    <div className="text-center space-y-3">
                        <AlertTriangle className="size-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                            Integration not found
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/integrations')}
                        >
                            Back to Integrations
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const integrationName =
        integration.displayName ?? integration.type ?? 'Integration';
    const status = (integration.status ?? '').toUpperCase();
    const isConnected = status === 'CONNECTED' || status === 'SYNCING';
    const isSyncing =
        status === 'SYNCING' || syncMutation.isPending;

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Integrations', href: '/integrations' },
                { label: integrationName },
            ]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-xl bg-muted flex items-center justify-center text-primary">
                                {getProviderIcon(integration.type)}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        {integrationName}
                                    </h1>
                                    <StatusBadge status={integration.status} />
                                </div>
                                {integration.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {integration.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {isConnected && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={disconnectMutation.isPending}
                            >
                                {disconnectMutation.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    'Disconnect'
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            {integration.type === 'SLACK' && (
                                <TabsTrigger value="channels">Channels</TabsTrigger>
                            )}
                            {integration.type === 'GOOGLE_DRIVE' && (
                                <TabsTrigger value="files">Files</TabsTrigger>
                            )}
                            <TabsTrigger value="sync-history">
                                Sync History
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-8 mt-6">
                            {/* Sync Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Database className="size-4" />
                                            Items Indexed
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">
                                            {(
                                                integration.itemsIndexed ?? 0
                                            ).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Clock className="size-4" />
                                            Last Sync
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">
                                            {integration.lastSyncedAt
                                                ? formatRelative(
                                                      integration.lastSyncedAt,
                                                  )
                                                : '--'}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <AlertCircle className="size-4" />
                                            Active Errors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold">
                                            {integration.syncStatusMessage
                                                ? 1
                                                : 0}
                                        </p>
                                        {integration.syncStatusMessage && (
                                            <p className="text-xs text-destructive mt-1 truncate">
                                                {integration.syncStatusMessage}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Configuration */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                    Configuration
                                </h3>
                                <Card>
                                    <CardContent className="divide-y">
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Connected Workspace
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {integration.workspaceId ??
                                                        '--'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Connected Since
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {integration.connectedAt
                                                        ? format(
                                                              new Date(
                                                                  integration.connectedAt,
                                                              ),
                                                              'MMM d, yyyy HH:mm',
                                                          )
                                                        : '--'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Auto-refresh Interval
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Every 6 hours
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Actions */}
                            {isConnected && (
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        className="gap-2"
                                    >
                                        {isSyncing ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="size-4" />
                                        )}
                                        {isSyncing
                                            ? 'Syncing...'
                                            : 'Sync Now'}
                                    </Button>

                                    {integration.type === 'GOOGLE_DRIVE' && integrationId && (
                                        <Button
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => setPickerOpen(true)}
                                        >
                                            <FolderOpen className="size-4" />
                                            Pick Files
                                        </Button>
                                    )}
                                </div>
                            )}

                            {pickerOpen && integrationId && (
                                <GoogleDrivePickerDialog
                                    integrationId={integrationId}
                                    onClose={() => setPickerOpen(false)}
                                />
                            )}
                        </TabsContent>

                        {/* Slack Channels Tab */}
                        {integration.type === 'SLACK' && integrationId && (
                            <TabsContent value="channels" className="mt-6">
                                <SlackChannelsTab integrationId={integrationId} />
                            </TabsContent>
                        )}

                        {/* Google Drive Files Tab */}
                        {integration.type === 'GOOGLE_DRIVE' && integrationId && (
                            <TabsContent value="files" className="mt-6">
                                <GoogleDriveFilesTab integrationId={integrationId} />
                            </TabsContent>
                        )}

                        {/* Sync History Tab */}
                        <TabsContent
                            value="sync-history"
                            className="space-y-4 mt-6"
                        >
                            {syncLoading && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {!syncLoading && !syncStatus && (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                    No sync history available
                                </div>
                            )}

                            {!syncLoading && syncStatus && (
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>
                                                        Items Processed
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>
                                                        Duration
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="text-sm">
                                                        {syncStatus.startedAt
                                                            ? format(
                                                                  new Date(
                                                                      syncStatus.startedAt,
                                                                  ),
                                                                  'MMM d, yyyy HH:mm',
                                                              )
                                                            : '--'}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {syncStatus.itemsSynced ??
                                                            0}{' '}
                                                        / {syncStatus.totalItems ?? 0}
                                                    </TableCell>
                                                    <TableCell>
                                                        {(syncStatus.status ?? '')
                                                            .toUpperCase() ===
                                                        'COMPLETED' ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                            >
                                                                Success
                                                            </Badge>
                                                        ) : (syncStatus.status ?? '')
                                                              .toUpperCase() ===
                                                          'FAILED' ? (
                                                            <Badge variant="destructive">
                                                                Failed
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                {syncStatus.status ??
                                                                    'Unknown'}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDuration(
                                                            syncStatus.startedAt,
                                                            syncStatus.completedAt,
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
