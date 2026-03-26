import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    CheckCircle,
    BookOpen,
    Filter,
    Brain,
    Loader2,
    PlugZap,
    CheckCircle2,
    X,
    RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/state/store';
import { integrationsQueryOptions } from '@/query/options/integrations';
import { useConnectIntegration } from '@/hooks/integrations/useConnectIntegration';
import { useDisconnectIntegration } from '@/hooks/integrations/useDisconnectIntegration';
import { useConnectNotion } from '@/hooks/integrations/useConnectNotion';
import { useTriggerSync } from '@/hooks/integrations/useTriggerSync';
import { useSyncNotion } from '@/hooks/integrations/useSyncNotion';
import { Schemas } from '@/types/api';

// --- OAuth providers that use redirect flow ---

const OAUTH_PROVIDERS = new Set(['NOTION']);

// --- Provider icon mapping (keyed by `type` field from API) ---

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

function getStatusDescription(integration: Schemas['IntegrationResponse']) {
    const status = (integration.status ?? '').toUpperCase();
    if (status === 'CONNECTED' || status === 'SYNCING') {
        const count = integration.itemsIndexed ?? 0;
        return count > 0
            ? `Indexing ${count.toLocaleString()} items`
            : 'Connected';
    }
    return integration.description ?? 'Connect to get started';
}

// --- Status Badge ---

function StatusBadge({ status }: { status?: string }) {
    const s = (status ?? '').toUpperCase();
    if (s === 'CONNECTED') {
        return (
            <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                CONNECTED
            </Badge>
        );
    }
    if (s === 'SYNCING') {
        return (
            <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-primary gap-1.5"
            >
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                SYNCING
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="text-muted-foreground">
            {s === 'DISCONNECTED' ? 'DISCONNECTED' : 'IDLE'}
        </Badge>
    );
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

// --- Integration Card ---

function IntegrationCard({
    integration,
    onConnect,
    onDisconnect,
    onSync,
    isConnecting,
    isDisconnecting,
    isSyncing,
}: {
    integration: Schemas['IntegrationResponse'];
    onConnect: () => void;
    onDisconnect: () => void;
    onSync: () => void;
    isConnecting: boolean;
    isDisconnecting: boolean;
    isSyncing: boolean;
}) {
    const status = (integration.status ?? '').toUpperCase();
    const isConnected = status === 'CONNECTED' || status === 'SYNCING';
    const isCurrSyncing = status === 'SYNCING' || isSyncing;
    const lastSync = formatLastSync(integration.lastSyncedAt);

    return (
        <Card className="group justify-between hover:border-primary/30 transition-all">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        {getProviderIcon(integration.type)}
                    </div>
                    <StatusBadge status={isCurrSyncing ? 'SYNCING' : integration.status} />
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <CardTitle className="text-xl">
                    {integration.displayName ?? integration.type ?? 'Unknown'}
                </CardTitle>
                <CardDescription>
                    {getStatusDescription(integration)}
                </CardDescription>
                {isConnected && lastSync && (
                    <p className="text-[10px] text-muted-foreground pt-1">
                        Last synced: {lastSync}
                    </p>
                )}
                {isConnected && integration.syncStatusMessage && (
                    <p className="text-[10px] text-muted-foreground">
                        {integration.syncStatusMessage}
                    </p>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                {isConnected ? (
                    <div className="flex w-full gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onSync}
                            disabled={isCurrSyncing}
                        >
                            {isCurrSyncing ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw className="size-3.5" />
                                    Sync
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onDisconnect}
                            disabled={isDisconnecting}
                        >
                            {isDisconnecting ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                'Disconnect'
                            )}
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
                            `Connect ${integration.displayName ?? integration.type ?? 'Source'}`
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

// --- Empty State ---

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <PlugZap className="size-12 mb-4" />
            <p className="text-lg font-semibold text-foreground mb-1">
                No integrations yet
            </p>
            <p className="text-sm max-w-md text-center">
                Connect your first source to start building your unified
                knowledge base. Integrations will appear here once configured.
            </p>
        </div>
    );
}

// --- Main Page ---

export function IntegrationsPage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [successProvider, setSuccessProvider] = useState<string | null>(null);

    // Detect OAuth callback redirect: ?connected=true&provider=notion
    useEffect(() => {
        const connected = searchParams.get('connected');
        const provider = searchParams.get('provider');

        if (connected === 'true' && provider) {
            setSuccessProvider(provider);

            // Refetch integrations to reflect the new connection
            queryClient.invalidateQueries({ queryKey: ['integrations'] });

            // Clean up URL params
            searchParams.delete('connected');
            searchParams.delete('provider');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams, queryClient]);

    const {
        data: integrations,
        isLoading,
        isError,
    } = useQuery(integrationsQueryOptions(selectedWorkspaceId ?? ''));

    const connectMutation = useConnectIntegration();
    const disconnectMutation = useDisconnectIntegration();
    const connectNotionMutation = useConnectNotion();
    const syncMutation = useTriggerSync();
    const syncNotionMutation = useSyncNotion();

    const handleConnect = (integrationType: string) => {
        if (!selectedWorkspaceId) return;

        // OAuth providers use redirect flow
        if (OAUTH_PROVIDERS.has(integrationType)) {
            if (integrationType === 'NOTION') {
                connectNotionMutation.mutate();
            }
            return;
        }

        // Non-OAuth providers use direct API connect
        connectMutation.mutate({
            workspaceId: selectedWorkspaceId,
            body: { provider: integrationType },
        });
    };

    const handleDisconnect = (integrationId: string) => {
        disconnectMutation.mutate({ integrationId });
    };

    const handleSync = (integrationId: string, integrationType: string) => {
        if (integrationType === 'NOTION') {
            syncNotionMutation.mutate({ integrationId });
        } else {
            syncMutation.mutate({ integrationId });
        }
    };

    const isTypeConnecting = (integrationType?: string) => {
        if (!integrationType) return false;
        if (OAUTH_PROVIDERS.has(integrationType)) {
            return integrationType === 'NOTION' && connectNotionMutation.isPending;
        }
        return (
            connectMutation.isPending &&
            connectMutation.variables?.body.provider === integrationType
        );
    };

    const hasIntegrations =
        !isLoading && !isError && integrations && integrations.length > 0;

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
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter leading-tight">
                                Sources.
                            </h1>
                            <p className="text-muted-foreground text-lg mt-2 max-w-xl">
                                Centralize your organizational intelligence.
                                Connect the tools your team uses every day to
                                build a unified knowledge base.
                            </p>
                        </div>
                        <Button variant="secondary" className="gap-2">
                            <Filter className="size-4" />
                            Filter
                        </Button>
                    </div>

                    {/* Success Banner */}
                    {successProvider && (
                        <SuccessBanner
                            provider={successProvider}
                            onDismiss={() => setSuccessProvider(null)}
                        />
                    )}

                    {/* Loading */}
                    {isLoading && <LoadingState />}

                    {/* Empty */}
                    {!isLoading && !hasIntegrations && <EmptyState />}

                    {/* Integration Grid */}
                    {hasIntegrations && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {integrations.map((integration) => (
                                <IntegrationCard
                                    key={integration.id ?? integration.type}
                                    integration={integration}
                                    onConnect={() =>
                                        handleConnect(
                                            integration.type ?? ''
                                        )
                                    }
                                    onDisconnect={() =>
                                        handleDisconnect(integration.id ?? '')
                                    }
                                    onSync={() =>
                                        handleSync(integration.id ?? '', integration.type ?? '')
                                    }
                                    isConnecting={isTypeConnecting(
                                        integration.type
                                    )}
                                    isDisconnecting={
                                        disconnectMutation.isPending &&
                                        disconnectMutation.variables
                                            ?.integrationId === integration.id
                                    }
                                    isSyncing={
                                        integration.type === 'NOTION'
                                            ? syncNotionMutation.isPending &&
                                              syncNotionMutation.variables
                                                  ?.integrationId === integration.id
                                            : syncMutation.isPending &&
                                              syncMutation.variables
                                                  ?.integrationId === integration.id
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* Featured Section */}
                    <div className="mt-12 grid grid-cols-12 gap-8">
                        {/* Knowledge Extraction */}
                        <div className="col-span-12 lg:col-span-8 bg-muted p-8 rounded-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black">
                                    Real-time Knowledge Extraction
                                </h2>
                                <p className="text-muted-foreground mt-2 max-w-md">
                                    Our AI automatically labels, categorizes,
                                    and links content across all connected
                                    sources.
                                </p>
                                <div className="mt-6 flex gap-4">
                                    <div className="bg-card p-4 rounded-xl shadow-sm border">
                                        <span className="text-xs font-bold text-primary block mb-1">
                                            ACCURACY
                                        </span>
                                        <span className="text-2xl font-black">
                                            99.4%
                                        </span>
                                    </div>
                                    <div className="bg-card p-4 rounded-xl shadow-sm border">
                                        <span className="text-xs font-bold text-primary block mb-1">
                                            LATENCY
                                        </span>
                                        <span className="text-2xl font-black">
                                            &lt;200ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 bg-gradient-to-l from-primary to-transparent pointer-events-none" />
                            <Brain className="absolute -bottom-6 -right-6 size-40 text-primary/5" />
                        </div>

                        {/* Request Source */}
                        <div className="col-span-12 lg:col-span-4 bg-primary text-primary-foreground p-8 rounded-xl flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Request Source
                                </h2>
                                <p className="text-primary-foreground/80 text-sm mt-2">
                                    Can't find what you're looking for? Suggest
                                    a new integration for our roadmap.
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                className="mt-6 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
                            >
                                Submit Request
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
