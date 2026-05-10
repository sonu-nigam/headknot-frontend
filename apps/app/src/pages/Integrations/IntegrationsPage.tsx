import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@workspace/ui/components/card';
import {
    HardDrive,
    MessageSquare,
    FileText,
    Code,
    BookOpen,
    CheckCircle,
    Loader2,
    PlugZap,
    CheckCircle2,
    AlertCircle,
    X,
    Database,
    RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { $api } from '@workspace/api-client';
import { invalidateByPath } from '@/lib/queryKeys';
import { useConnectIntegration } from '@/hooks/integrations/useConnectIntegration';
import { useTriggerSync } from '@/hooks/integrations/useTriggerSync';
import { Schemas } from '@/types/api';
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

// --- Helpers ---

function formatLastSync(dateStr?: string) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
}

// --- Merged catalog item ---

interface CatalogItem {
    integration?: Schemas['IntegrationResponse'];
    type: string;
    displayName: string;
    description: string;
    isConnected: boolean;
}

function mergeCatalog(
    integrations?: Schemas['IntegrationResponse'][],
): CatalogItem[] {
    const items: CatalogItem[] = [];
    for (const i of integrations ?? []) {
        const key = i.type ?? '';
        if (!key) continue;
        const status = (i.status ?? '').toUpperCase();
        items.push({
            integration: i,
            type: key,
            displayName: i.displayName ?? key,
            description: i.description ?? '',
            isConnected: status === 'CONNECTED' || status === 'SYNCING',
        });
    }
    return items.sort((a, b) => {
        if (a.isConnected !== b.isConnected) return a.isConnected ? -1 : 1;
        return a.displayName.localeCompare(b.displayName);
    });
}

// --- Success Banner ---

function SuccessBanner({
    provider,
    onDismiss,
}: {
    provider: string;
    onDismiss: () => void;
}) {
    return (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    <span className="capitalize">{provider}</span> has been
                    successfully connected to your workspace.
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

// --- Error Banner ---

function ErrorBanner({
    message,
    onDismiss,
}: {
    message: string;
    onDismiss: () => void;
}) {
    return (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
            <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive">
                    {message}
                </p>
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

// --- Integration Catalog Card ---

function CatalogCard({
    item,
    onConnect,
    isConnecting,
    onSync,
    isSyncing,
}: {
    item: CatalogItem;
    onConnect: () => void;
    isConnecting: boolean;
    onSync: () => void;
    isSyncing: boolean;
}) {
    const navigate = useNavigate();
    const lastSync = formatLastSync(item.integration?.lastSyncedAt);
    const itemsIndexed = item.integration?.itemsIndexed ?? 0;

    return (
        <Card className="group justify-between hover:border-primary/30 transition-all">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        {getProviderIcon(item.type)}
                    </div>
                    {item.isConnected ? (
                        <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5"
                        >
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Connected
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-muted-foreground">
                            Not connected
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <CardTitle className="text-xl">{item.displayName}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                {item.isConnected && (
                    <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                        {lastSync && <span>Synced {lastSync}</span>}
                        {itemsIndexed > 0 && (
                            <span className="flex items-center gap-1">
                                <Database className="size-3" />
                                {itemsIndexed.toLocaleString()} items
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                {item.isConnected ? (
                    <div className="flex gap-2 w-full">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onSync}
                            disabled={isSyncing}
                            title="Sync Now"
                        >
                            <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                                navigate(`/integrations/${item.integration?.id}`)
                            }
                        >
                            Manage
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="w-full"
                        onClick={onConnect}
                        disabled={isConnecting}
                    >
                        {isConnecting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            'Connect'
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

// --- Loading State ---

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="size-8 animate-spin mb-4" />
            <p className="text-sm font-medium">Loading integrations...</p>
        </div>
    );
}

// --- Main Page ---

export function IntegrationsPage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [successProvider, setSuccessProvider] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [googleDrivePickerState, setGoogleDrivePickerState] = useState<{
        integrationId: string;
    } | null>(null);

    // Detect OAuth callback redirect: ?connected=true&provider=notion or ?error=...
    useEffect(() => {
        const connected = searchParams.get('connected');
        const provider = searchParams.get('provider');
        const type = searchParams.get('type');
        const integrationId = searchParams.get('integrationId');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
            const providerLabel = provider ? `${provider.charAt(0).toUpperCase()}${provider.slice(1)}` : 'Integration';
            setErrorMessage(
                errorDescription
                    ? `${providerLabel} connection failed: ${errorDescription}`
                    : `${providerLabel} connection failed: ${errorParam}`,
            );
            invalidateByPath(queryClient, 'get', '/integrations');
            searchParams.delete('error');
            searchParams.delete('error_description');
            searchParams.delete('provider');
            searchParams.delete('type');
            searchParams.delete('integrationId');
            setSearchParams(searchParams, { replace: true });
            return;
        }

        if (connected === 'true' && provider) {
            if (type === 'GOOGLE_DRIVE' && integrationId) {
                setGoogleDrivePickerState({ integrationId });
            } else {
                setSuccessProvider(provider);
            }

            invalidateByPath(queryClient, "get", "/integrations");

            searchParams.delete('connected');
            searchParams.delete('provider');
            searchParams.delete('type');
            searchParams.delete('integrationId');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams, queryClient]);

    const {
        data: integrations,
        isLoading: integrationsLoading,
    } = $api.useQuery("get", "/integrations/workspace/{workspaceId}", {
        params: { path: { workspaceId: selectedWorkspaceId ?? '' } },
    }, { enabled: !!selectedWorkspaceId });

    const connectMutation = useConnectIntegration();
    const syncMutation = useTriggerSync();

    const isLoading = integrationsLoading;

    const catalog = mergeCatalog(integrations);
    const connectedCount = catalog.filter((c) => c.isConnected).length;
    const totalItems = (integrations ?? []).reduce<number>(
        (sum, i) => sum + ((i as Schemas['IntegrationResponse']).itemsIndexed ?? 0),
        0,
    );

    const handleConnect = (item: CatalogItem) => {
        if (!selectedWorkspaceId) return;

        const integrationId = item.integration?.id;
        if (!integrationId) return;

        const authMethod = (item.integration?.authMethod ?? '').toUpperCase();

        setErrorMessage(null);
        connectMutation.mutate(
            {
                params: { path: { id: integrationId } },
                body: {
                    workspaceId: selectedWorkspaceId,
                    ...(authMethod ? { authMethod } : {}),
                },
            },
            {
                onSuccess: (data) => {
                    if (authMethod === 'OAUTH2' && !data?.authorizationUrl) {
                        setErrorMessage(
                            `${item.displayName} did not return an authorization URL. The provider may not be configured on the backend.`,
                        );
                    }
                },
                onError: (err: unknown) => {
                    const msg =
                        err instanceof Error && err.message
                            ? err.message
                            : `Failed to connect ${item.displayName}. Please try again.`;
                    setErrorMessage(msg);
                },
            },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Integrations' },
            ]}
        >
            <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Integrations
                        </h1>
                        <p className="text-muted-foreground mt-1 max-w-xl">
                            Connect your tools to automatically enrich your
                            knowledge graph.
                        </p>
                    </div>

                    {/* Summary */}
                    {!isLoading && catalog.length > 0 && (
                        <div className="flex items-center gap-6 mb-8 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    {connectedCount} of {catalog.length}
                                </span>
                                <span className="text-muted-foreground">
                                    connected
                                </span>
                            </div>
                            {totalItems > 0 && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Database className="size-4" />
                                    <span>
                                        {totalItems.toLocaleString()} total
                                        items indexed
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Success Banner */}
                    {successProvider && (
                        <SuccessBanner
                            provider={successProvider}
                            onDismiss={() => setSuccessProvider(null)}
                        />
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <ErrorBanner
                            message={errorMessage}
                            onDismiss={() => setErrorMessage(null)}
                        />
                    )}

                    {/* Google Drive Picker */}
                    {googleDrivePickerState && (
                        <GoogleDrivePickerDialog
                            integrationId={googleDrivePickerState.integrationId}
                            onClose={() => {
                                setGoogleDrivePickerState(null);
                                setSuccessProvider('google_drive');
                            }}
                        />
                    )}

                    {/* Loading */}
                    {isLoading && <LoadingState />}

                    {/* Integration Grid */}
                    {!isLoading && catalog.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {catalog.map((item) => (
                                <CatalogCard
                                    key={item.type}
                                    item={item}
                                    onConnect={() => handleConnect(item)}
                                    isConnecting={connectMutation.isPending}
                                    onSync={() => {
                                        if (item.integration?.id) {
                                            syncMutation.mutate({
                                                params: { path: { id: item.integration.id } },
                                            });
                                        }
                                    }}
                                    isSyncing={syncMutation.isPending}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty state: no providers at all */}
                    {!isLoading && catalog.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                            <PlugZap className="size-12 mb-4" />
                            <p className="text-lg font-semibold text-foreground mb-1">
                                No integrations available
                            </p>
                            <p className="text-sm max-w-md text-center">
                                Integration providers will appear here once
                                configured by your administrator.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
