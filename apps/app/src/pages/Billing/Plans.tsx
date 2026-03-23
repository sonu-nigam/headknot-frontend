import { useQuery } from '@tanstack/react-query';
import { plansQueryOptions } from '@/query/options/billing';
import { useAppStore } from '@/state/store';
import { useSubscribeWorkspace } from '@/hooks/billing/useSubscribeWorkspace';
import { useChangePlan } from '@/hooks/billing/useChangePlan';
import { workspaceSubscriptionQueryOptions } from '@/query/options/billing';
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
import { CheckIcon } from 'lucide-react';

export function Plans() {
    const { selectedWorkspaceId } = useAppStore();
    const { data: plans, isLoading } = useQuery(plansQueryOptions);
    const { data: subscription } = useQuery(
        workspaceSubscriptionQueryOptions(selectedWorkspaceId ?? '')
    );
    const subscribeMutation = useSubscribeWorkspace();
    const changePlanMutation = useChangePlan();

    const currentPlanId = subscription?.planId;
    const isSubscribed = !!subscription?.status;

    const handleSelectPlan = (planName: string) => {
        if (!selectedWorkspaceId) return;

        if (isSubscribed) {
            changePlanMutation.mutate({
                workspaceId: selectedWorkspaceId,
                body: { planName },
            });
        } else {
            subscribeMutation.mutate({
                workspaceId: selectedWorkspaceId,
                body: { planName },
            });
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">Loading plans...</CardContent>
            </Card>
        );
    }

    if (!plans?.length) {
        return (
            <Card>
                <CardContent className="p-6">
                    No plans available.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {plans.map((plan) => {
                const isCurrent = plan.id === currentPlanId;
                return (
                    <Card key={plan.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {plan.displayName ?? plan.name}
                                        {isCurrent && (
                                            <Badge variant="secondary">
                                                Current
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {plan.description}
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    {plan.priceMonthly != null &&
                                    plan.priceMonthly > 0 ? (
                                        <div>
                                            <span className="text-2xl font-bold">
                                                ${plan.priceMonthly}
                                            </span>
                                            <span className="text-muted-foreground">
                                                /mo
                                            </span>
                                            {plan.priceYearly != null &&
                                                plan.priceYearly > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        ${plan.priceYearly}/yr
                                                    </p>
                                                )}
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <PlanFeature
                                    label="Memories"
                                    value={plan.maxMemories}
                                />
                                <PlanFeature
                                    label="Entities"
                                    value={plan.maxEntities}
                                />
                                <PlanFeature
                                    label="Workspaces"
                                    value={plan.maxWorkspaces}
                                />
                                <PlanFeature
                                    label="Members per workspace"
                                    value={plan.maxMembersPerWorkspace}
                                />
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={isCurrent ? 'outline' : 'default'}
                                disabled={
                                    isCurrent ||
                                    subscribeMutation.isPending ||
                                    changePlanMutation.isPending
                                }
                                onClick={() =>
                                    plan.name && handleSelectPlan(plan.name)
                                }
                            >
                                {isCurrent
                                    ? 'Current Plan'
                                    : isSubscribed
                                      ? 'Switch to this Plan'
                                      : 'Get Started'}
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

function PlanFeature({
    label,
    value,
}: {
    label: string;
    value?: number;
}) {
    if (value == null) return null;
    return (
        <li className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <span>
                {value === -1 ? 'Unlimited' : value} {label}
            </span>
        </li>
    );
}
