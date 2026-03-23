import { useQuery } from '@tanstack/react-query';
import {
    workspaceSubscriptionQueryOptions,
    plansQueryOptions,
} from '@/query/options/billing';
import { useAppStore } from '@/state/store';
import { useCancelSubscription } from '@/hooks/billing/useCancelSubscription';
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
import { format } from 'date-fns';
import React from 'react';

export function Subscription() {
    const { selectedWorkspaceId } = useAppStore();
    const { data: subscription, isLoading } = useQuery(
        workspaceSubscriptionQueryOptions(selectedWorkspaceId ?? '')
    );
    const { data: plans } = useQuery(plansQueryOptions);
    const cancelMutation = useCancelSubscription();
    const [showConfirm, setShowConfirm] = React.useState(false);

    const currentPlan = plans?.find((p) => p.id === subscription?.planId);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
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
            { workspaceId: selectedWorkspaceId },
            { onSuccess: () => setShowConfirm(false) }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Subscription
                    {subscription.status && (
                        <Badge
                            variant={
                                subscription.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {subscription.status}
                        </Badge>
                    )}
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
                    {subscription.startedAt && (
                        <div>
                            <p className="text-muted-foreground">Started</p>
                            <p className="font-medium">
                                {format(
                                    new Date(subscription.startedAt),
                                    'MMM d, yyyy'
                                )}
                            </p>
                        </div>
                    )}
                    {subscription.expiresAt && (
                        <div>
                            <p className="text-muted-foreground">Expires</p>
                            <p className="font-medium">
                                {format(
                                    new Date(subscription.expiresAt),
                                    'MMM d, yyyy'
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                {!showConfirm ? (
                    <Button
                        variant="destructive"
                        onClick={() => setShowConfirm(true)}
                        disabled={subscription.status !== 'active'}
                    >
                        Cancel Subscription
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Are you sure?
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancel}
                            disabled={cancelMutation.isPending}
                        >
                            {cancelMutation.isPending
                                ? 'Cancelling...'
                                : 'Confirm'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowConfirm(false)}
                        >
                            Keep Plan
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
