import React from 'react';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useCancelSubscription } from '@/hooks/billing/useCancelSubscription';
import { useOpenCustomerPortal } from '@/hooks/billing/useOpenCustomerPortal';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { differenceInDays, format } from 'date-fns';
import { CreditCard, Loader2 } from 'lucide-react';
import type { Schemas } from '@/types/api';

function StatusBadge({ status }: { status?: string }) {
    const s = (status ?? '').toUpperCase();
    if (s === 'ACTIVE') {
        return (
            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Active
            </Badge>
        );
    }
    if (s === 'SUSPENDED') {
        return (
            <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Payment failed
            </Badge>
        );
    }
    if (s === 'CANCELLED' || s === 'CANCELED' || s === 'EXPIRED') {
        return (
            <Badge variant="secondary" className="text-muted-foreground">
                {s.charAt(0) + s.slice(1).toLowerCase()}
            </Badge>
        );
    }
    return <Badge variant="secondary">{s || 'Unknown'}</Badge>;
}

export function Subscription() {
    const { selectedWorkspaceId } = useAppStore();
    const { data: subscription, isLoading } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/subscription',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );
    const { data: plans } = $api.useQuery('get', '/billing/plans');
    const cancelMutation = useCancelSubscription();
    const portalMutation = useOpenCustomerPortal();
    const [showConfirm, setShowConfirm] = React.useState(false);

    const currentPlan = plans?.find(
        (p: Schemas['PlanResponse']) => p.id === subscription?.planId,
    );
    const status = (subscription?.status ?? '').toUpperCase();
    const isSuspended = status === 'SUSPENDED';

    // Trial countdown: the backend's auto-trial puts the workspace into ACTIVE
    // status with an `expiresAt` set to trial-end. Once the user pays, the
    // webhook moves `expiresAt` forward to the next renewal. We display the
    // upcoming date generically as the period end.
    const periodEnd = subscription?.expiresAt
        ? new Date(subscription.expiresAt)
        : null;
    const daysLeft = periodEnd
        ? differenceInDays(periodEnd, new Date())
        : null;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading subscription...
                </CardContent>
            </Card>
        );
    }

    if (!subscription?.id) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>
                        You don't have an active subscription for this
                        workspace. Browse the Plans tab to get started.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const handleCancel = () => {
        if (!selectedWorkspaceId) return;
        cancelMutation.mutate(
            { params: { path: { workspaceId: selectedWorkspaceId } } },
            { onSuccess: () => setShowConfirm(false) },
        );
    };

    const handleManage = () => {
        if (!selectedWorkspaceId) return;
        portalMutation.mutate({
            params: { path: { workspaceId: selectedWorkspaceId } },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Subscription
                    <StatusBadge status={subscription.status} />
                </CardTitle>
                <CardDescription>
                    Manage your workspace subscription.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Plan</p>
                        <p className="font-medium">
                            {currentPlan?.displayName ??
                                currentPlan?.name ??
                                'Unknown'}
                        </p>
                    </div>
                    {status === 'ACTIVE' &&
                        daysLeft !== null &&
                        daysLeft >= 0 && (
                            <div>
                                <p className="text-muted-foreground">
                                    {(currentPlan?.trialDays ?? 0) > 0 &&
                                    daysLeft <= (currentPlan?.trialDays ?? 0)
                                        ? 'Trial ends in'
                                        : 'Renews on'}
                                </p>
                                <p className="font-medium">
                                    {(currentPlan?.trialDays ?? 0) > 0 &&
                                    daysLeft <= (currentPlan?.trialDays ?? 0)
                                        ? `${daysLeft} day${daysLeft === 1 ? '' : 's'}`
                                        : periodEnd
                                          ? format(periodEnd, 'MMM d, yyyy')
                                          : '--'}
                                </p>
                            </div>
                        )}
                    {subscription.startedAt && (
                        <div>
                            <p className="text-muted-foreground">Started</p>
                            <p className="font-medium">
                                {format(
                                    new Date(subscription.startedAt),
                                    'MMM d, yyyy',
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center gap-2">
                <Button
                    onClick={handleManage}
                    disabled={portalMutation.isPending}
                    className="gap-2"
                    variant={isSuspended ? 'default' : 'default'}
                >
                    {portalMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <CreditCard className="size-4" />
                    )}
                    {isSuspended ? 'Update payment method' : 'Manage billing'}
                </Button>

                {status === 'ACTIVE' && !showConfirm && (
                    <Button
                        variant="outline"
                        onClick={() => setShowConfirm(true)}
                    >
                        Cancel Subscription
                    </Button>
                )}

                {showConfirm && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {periodEnd
                                ? `You'll keep access until ${format(periodEnd, 'MMM d, yyyy')}.`
                                : 'Cancel at period end?'}
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancel}
                            disabled={cancelMutation.isPending}
                        >
                            {cancelMutation.isPending
                                ? 'Cancelling...'
                                : 'Confirm cancel'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowConfirm(false)}
                        >
                            Keep plan
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
