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
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@workspace/ui/components/sheet';
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
    CheckCircle2,
    FolderOpen,
    ChevronDown,
    ChevronRight,
    X,
    Play,
    RotateCw,
} from 'lucide-react';
import { useDisconnectIntegration } from '@/hooks/integrations/useDisconnectIntegration';
import { useTriggerSync } from '@/hooks/integrations/useTriggerSync';
import { useSyncRuns, DEFAULT_SYNC_RUNS_PAGE_SIZE } from '@/hooks/integrations/useSyncRuns';
import { useSyncRunItems } from '@/hooks/integrations/useSyncRunItems';
import { useCancelSyncRun } from '@/hooks/integrations/useCancelSyncRun';
import { useResumeSyncRun } from '@/hooks/integrations/useResumeSyncRun';
import { useRetrySyncRunItem } from '@/hooks/integrations/useRetrySyncRunItem';
import { $api } from '@workspace/api-client';
import { Schemas } from '@/types/api';
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

// --- Sync Run Status Badge ---

function SyncRunStatusBadge({ status }: { status?: string }) {
    const s = (status ?? '').toUpperCase();
    if (s === 'COMPLETED') {
        return (
            <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
                Completed
            </Badge>
        );
    }
    if (s === 'RUNNING') {
        return (
            <Badge
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                Running
            </Badge>
        );
    }
    if (s === 'QUEUED') {
        return (
            <Badge
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
                Queued
            </Badge>
        );
    }
    if (s === 'INTERRUPTED') {
        return (
            <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
                Interrupted
            </Badge>
        );
    }
    if (s === 'CANCELLED' || s === 'CANCELED') {
        return (
            <Badge variant="secondary" className="text-muted-foreground">
                Cancelled
            </Badge>
        );
    }
    if (s === 'FAILED') {
        return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="secondary">{s || 'Unknown'}</Badge>;
}

// --- Banners ---

function SuccessBanner({
    message,
    onDismiss,
}: {
    message: string;
    onDismiss: () => void;
}) {
    return (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    {message}
                </p>
            </div>
            <button
                onClick={onDismiss}
                className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
            >
                <X className="size-4" />
            </button>
        </div>
    );
}

function ErrorBanner({
    message,
    onDismiss,
}: {
    message: string;
    onDismiss: () => void;
}) {
    return (
        <div className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
            <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive">{message}</p>
            </div>
            <button
                onClick={onDismiss}
                className="text-destructive hover:opacity-80 shrink-0"
            >
                <X className="size-4" />
            </button>
        </div>
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

    const disconnectMutation = useDisconnectIntegration();
    const syncMutation = useTriggerSync();
    const cancelRunMutation = useCancelSyncRun();
    const resumeRunMutation = useResumeSyncRun();

    const [pickerOpen, setPickerOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Sync history state
    const [historyPage, setHistoryPage] = useState(0);
    const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
    const [failedItemsRunId, setFailedItemsRunId] = useState<string | null>(null);

    const {
        data: syncRuns,
        isLoading: syncRunsLoading,
    } = useSyncRuns(integrationId, {
        limit: DEFAULT_SYNC_RUNS_PAGE_SIZE,
        offset: historyPage * DEFAULT_SYNC_RUNS_PAGE_SIZE,
    });

    const surfaceMutationError = (err: unknown, fallback: string) => {
        const msg = err instanceof Error && err.message ? err.message : fallback;
        setErrorMessage(msg);
        setSuccessMessage(null);
    };

    const handleCancelRun = (runId: string) => {
        if (!integrationId) return;
        setErrorMessage(null);
        cancelRunMutation.mutate(
            { params: { path: { id: integrationId, runId } } },
            {
                onSuccess: () => setSuccessMessage('Sync run cancelled.'),
                onError: (err) => surfaceMutationError(err, 'Failed to cancel sync run.'),
            },
        );
    };

    const handleResumeRun = (runId: string) => {
        if (!integrationId) return;
        setErrorMessage(null);
        resumeRunMutation.mutate(
            { params: { path: { id: integrationId, runId } } },
            {
                onSuccess: () => setSuccessMessage('Sync run resumed.'),
                onError: (err) => surfaceMutationError(err, 'Failed to resume sync run.'),
            },
        );
    };

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

                    {/* Banners */}
                    {successMessage && (
                        <SuccessBanner
                            message={successMessage}
                            onDismiss={() => setSuccessMessage(null)}
                        />
                    )}
                    {errorMessage && (
                        <ErrorBanner
                            message={errorMessage}
                            onDismiss={() => setErrorMessage(null)}
                        />
                    )}

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
                            <SyncHistory
                                runs={syncRuns}
                                isLoading={syncRunsLoading}
                                page={historyPage}
                                pageSize={DEFAULT_SYNC_RUNS_PAGE_SIZE}
                                onPageChange={setHistoryPage}
                                expandedRunId={expandedRunId}
                                onToggleExpanded={(runId) =>
                                    setExpandedRunId((prev) =>
                                        prev === runId ? null : runId,
                                    )
                                }
                                onViewFailedItems={(runId) =>
                                    setFailedItemsRunId(runId)
                                }
                                onCancelRun={handleCancelRun}
                                cancellingRunId={
                                    cancelRunMutation.isPending
                                        ? cancelRunMutation.variables?.params
                                              .path.runId
                                        : null
                                }
                                onResumeRun={handleResumeRun}
                                resumingRunId={
                                    resumeRunMutation.isPending
                                        ? resumeRunMutation.variables?.params
                                              .path.runId
                                        : null
                                }
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {integrationId && failedItemsRunId && (
                <FailedItemsSheet
                    integrationId={integrationId}
                    runId={failedItemsRunId}
                    open={!!failedItemsRunId}
                    onOpenChange={(open) => {
                        if (!open) setFailedItemsRunId(null);
                    }}
                />
            )}
        </AppLayout>
    );
}

// --- Sync History list ---

interface SyncHistoryProps {
    runs: Schemas['SyncRunResponse'][] | undefined;
    isLoading: boolean;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    expandedRunId: string | null;
    onToggleExpanded: (runId: string) => void;
    onViewFailedItems: (runId: string) => void;
    onCancelRun: (runId: string) => void;
    cancellingRunId: string | null | undefined;
    onResumeRun: (runId: string) => void;
    resumingRunId: string | null | undefined;
}

function SyncHistory({
    runs,
    isLoading,
    page,
    pageSize,
    onPageChange,
    expandedRunId,
    onToggleExpanded,
    onViewFailedItems,
    onCancelRun,
    cancellingRunId,
    onResumeRun,
    resumingRunId,
}: SyncHistoryProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!runs || runs.length === 0) {
        if (page > 0) {
            return (
                <div className="flex items-center justify-between py-12">
                    <span className="text-sm text-muted-foreground">
                        No more runs.
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page - 1)}
                    >
                        Previous
                    </Button>
                </div>
            );
        }
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                No sync history available
            </div>
        );
    }

    const hasNextPage = runs.length === pageSize;

    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-8" />
                                <TableHead>Started</TableHead>
                                <TableHead>Trigger</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {runs.map((run) => {
                                const isExpanded = expandedRunId === run.id;
                                const runStatus = (run.status ?? '').toUpperCase();
                                const isRunning =
                                    runStatus === 'RUNNING' ||
                                    runStatus === 'QUEUED';
                                const isInterrupted = runStatus === 'INTERRUPTED';
                                return (
                                    <SyncRunRow
                                        key={run.id ?? ''}
                                        run={run}
                                        isExpanded={isExpanded}
                                        onToggleExpanded={() =>
                                            run.id && onToggleExpanded(run.id)
                                        }
                                        onViewFailedItems={() =>
                                            run.id && onViewFailedItems(run.id)
                                        }
                                        onCancelRun={() =>
                                            run.id && onCancelRun(run.id)
                                        }
                                        isCancelling={
                                            !!run.id && cancellingRunId === run.id
                                        }
                                        canCancel={isRunning}
                                        onResumeRun={() =>
                                            run.id && onResumeRun(run.id)
                                        }
                                        isResuming={
                                            !!run.id && resumingRunId === run.id
                                        }
                                        canResume={isInterrupted}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                    Page {page + 1}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(0, page - 1))}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={!hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}

// --- Single sync-run row + expansion ---

interface SyncRunRowProps {
    run: Schemas['SyncRunResponse'];
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onViewFailedItems: () => void;
    onCancelRun: () => void;
    isCancelling: boolean;
    canCancel: boolean;
    onResumeRun: () => void;
    isResuming: boolean;
    canResume: boolean;
}

function SyncRunRow({
    run,
    isExpanded,
    onToggleExpanded,
    onViewFailedItems,
    onCancelRun,
    isCancelling,
    canCancel,
    onResumeRun,
    isResuming,
    canResume,
}: SyncRunRowProps) {
    const failedCount = run.failedItems ?? 0;
    const processed = run.processedItems ?? 0;
    const total = run.totalItems ?? 0;

    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-muted/40"
                onClick={onToggleExpanded}
            >
                <TableCell className="w-8 text-muted-foreground">
                    {isExpanded ? (
                        <ChevronDown className="size-4" />
                    ) : (
                        <ChevronRight className="size-4" />
                    )}
                </TableCell>
                <TableCell className="text-sm">
                    {run.startedAt
                        ? format(new Date(run.startedAt), 'MMM d, yyyy HH:mm')
                        : '--'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">
                    {(run.triggerType ?? '--').toLowerCase()}
                </TableCell>
                <TableCell className="text-sm">
                    {processed} / {total || '--'}
                </TableCell>
                <TableCell>
                    <SyncRunStatusBadge status={run.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    {formatDuration(run.startedAt, run.endedAt)}
                </TableCell>
                <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                >
                    {canCancel && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCancelRun}
                            disabled={isCancelling}
                            className="gap-1.5"
                        >
                            {isCancelling ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : (
                                <X className="size-3" />
                            )}
                            Cancel
                        </Button>
                    )}
                    {canResume && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onResumeRun}
                            disabled={isResuming}
                            className="gap-1.5"
                        >
                            {isResuming ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : (
                                <Play className="size-3" />
                            )}
                            Resume
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell colSpan={7} className="py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Succeeded
                                </p>
                                <p className="font-semibold">
                                    {run.succeededItems ?? 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Failed
                                </p>
                                <p className="font-semibold text-destructive">
                                    {failedCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Skipped
                                </p>
                                <p className="font-semibold">
                                    {run.skippedItems ?? 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Ended
                                </p>
                                <p className="font-semibold">
                                    {run.endedAt
                                        ? formatRelative(run.endedAt)
                                        : '--'}
                                </p>
                            </div>
                        </div>
                        {run.lastError && (
                            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                                <p className="text-xs font-medium text-destructive">
                                    {run.lastError}
                                </p>
                            </div>
                        )}
                        {failedCount > 0 && (
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onViewFailedItems}
                                    className="gap-1.5"
                                >
                                    <AlertCircle className="size-3" />
                                    View {failedCount} failed item
                                    {failedCount === 1 ? '' : 's'}
                                </Button>
                            </div>
                        )}
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

// --- Failed items drawer ---

function FailedItemsSheet({
    integrationId,
    runId,
    open,
    onOpenChange,
}: {
    integrationId: string;
    runId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data: items, isLoading } = useSyncRunItems(integrationId, runId, {
        status: 'FAILED',
        limit: 100,
    });
    const retryMutation = useRetrySyncRunItem();

    const handleRetry = (itemId: string) => {
        retryMutation.mutate({
            params: { path: { id: integrationId, runId, itemId } },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>Failed items</SheetTitle>
                    <SheetDescription>
                        Items in this run that failed to extract. Retry to send
                        them back through the pipeline.
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-4 overflow-y-auto flex-1">
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {!isLoading && (!items || items.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            No failed items.
                        </div>
                    )}
                    {!isLoading && items && items.length > 0 && (
                        <ul className="space-y-3 mt-4">
                            {items.map((it: Schemas['SyncRunItemResponse']) => {
                                const isRetrying =
                                    retryMutation.isPending &&
                                    retryMutation.variables?.params.path.itemId ===
                                        it.id;
                                return (
                                    <li
                                        key={it.id}
                                        className="rounded-md border bg-card p-3 space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {it.displayName ||
                                                        it.externalId ||
                                                        it.id}
                                                </p>
                                                {it.itemType && (
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {it.itemType.toLowerCase()}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    it.id && handleRetry(it.id)
                                                }
                                                disabled={isRetrying || !it.id}
                                                className="gap-1.5 shrink-0"
                                            >
                                                {isRetrying ? (
                                                    <Loader2 className="size-3 animate-spin" />
                                                ) : (
                                                    <RotateCw className="size-3" />
                                                )}
                                                Retry
                                            </Button>
                                        </div>
                                        {(it.failureReason || it.lastError) && (
                                            <p className="text-xs text-destructive">
                                                {it.failureReason
                                                    ? `${it.failureReason}: `
                                                    : ''}
                                                {it.lastError ?? ''}
                                            </p>
                                        )}
                                        {it.attemptCount !== undefined &&
                                            it.attemptCount > 1 && (
                                                <p className="text-xs text-muted-foreground">
                                                    {it.attemptCount} attempts
                                                </p>
                                            )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
