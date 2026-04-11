import AppLayout from '@/components/AppLayout';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useChangePlan } from '@/hooks/billing/useChangePlan';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import {
    CreditCard,
    Download,
    CheckCircle,
    Loader2,
    Zap,
    Crown,
    Building2,
} from 'lucide-react';

function UsageBar({
    label,
    current,
    limit,
}: {
    label: string;
    current: number;
    limit: number;
}) {
    const isUnlimited = limit === -1;
    const percent = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
    const barColor =
        percent > 80
            ? 'bg-red-500'
            : percent > 60
              ? 'bg-yellow-500'
              : 'bg-primary';

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-medium">
                    {current.toLocaleString()} /{' '}
                    {isUnlimited ? 'Unlimited' : limit.toLocaleString()}
                </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} rounded-full transition-all`}
                    style={{
                        width: isUnlimited ? '0%' : `${percent}%`,
                    }}
                />
            </div>
            {!isUnlimited && (
                <p className="text-xs text-muted-foreground text-right">
                    {Math.round(percent)}% utilized
                </p>
            )}
        </div>
    );
}

export function BillingPage() {
    const { selectedWorkspaceId } = useAppStore();

    const { data: plans, isLoading: plansLoading } =
        $api.useQuery("get", "/billing/plans");
    const { data: subscription, isLoading: subLoading } = $api.useQuery(
        "get", "/billing/workspace/{workspaceId}/subscription",
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );
    const { data: usage } = $api.useQuery(
        "get", "/billing/workspace/{workspaceId}/usage",
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );
    const { data: limits } = $api.useQuery(
        "get", "/billing/workspace/{workspaceId}/limits",
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );

    const changePlan = useChangePlan();

    const currentPlan = plans?.find((p) => p.id === subscription?.planId);
    const isLoading = plansLoading || subLoading;

    const getUsageValue = (metric: string) =>
        usage?.find((u) => u.metric === metric)?.value ?? 0;
    const getLimitValue = (metric: string) =>
        limits?.find((l) => l.metric === metric)?.limit ?? 0;

    const planIcons: Record<string, React.ReactNode> = {
        free: <Zap className="size-5" />,
        pro: <Crown className="size-5" />,
        enterprise: <Building2 className="size-5" />,
    };

    return (
        <AppLayout
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Billing' }]}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 pb-32 max-w-5xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Billing & Usage
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage your subscription and monitor usage.
                        </p>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {/* Current Plan */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Current Plan
                                            </CardTitle>
                                            <CardDescription>
                                                {currentPlan
                                                    ? `You are on the ${currentPlan.displayName ?? currentPlan.name} plan.`
                                                    : 'No active subscription.'}
                                            </CardDescription>
                                        </div>
                                        {currentPlan && (
                                            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
                                                {currentPlan.displayName ??
                                                    currentPlan.name}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Billing
                                            </p>
                                            <p className="font-medium">
                                                Monthly
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Status
                                            </p>
                                            <p className="font-medium text-green-500">
                                                {subscription?.status ??
                                                    'Active'}
                                            </p>
                                        </div>
                                        {currentPlan?.priceMonthly !==
                                            undefined && (
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Price
                                                </p>
                                                <p className="font-medium">
                                                    $
                                                    {currentPlan.priceMonthly}
                                                    /mo
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Usage */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Usage
                                    </CardTitle>
                                    <CardDescription>
                                        Current resource utilization for this
                                        workspace.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <UsageBar
                                        label="Entities"
                                        current={getUsageValue('entities')}
                                        limit={getLimitValue('entities')}
                                    />
                                    <UsageBar
                                        label="Claims"
                                        current={getUsageValue('claims')}
                                        limit={getLimitValue('claims')}
                                    />
                                    <UsageBar
                                        label="Workspaces"
                                        current={getUsageValue('workspaces')}
                                        limit={getLimitValue('workspaces')}
                                    />
                                </CardContent>
                            </Card>

                            {/* Plan Comparison */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Available Plans
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {plans?.map((plan) => {
                                            const isCurrent =
                                                plan.id ===
                                                subscription?.planId;
                                            return (
                                                <div
                                                    key={plan.id}
                                                    className={`rounded-xl border-2 p-5 space-y-4 transition-all ${
                                                        isCurrent
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-muted-foreground/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {planIcons[
                                                            plan.name ?? ''
                                                        ] ?? (
                                                            <Zap className="size-5" />
                                                        )}
                                                        <h3 className="font-bold">
                                                            {plan.displayName ??
                                                                plan.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {plan.priceMonthly ===
                                                        0
                                                            ? 'Free'
                                                            : plan.priceMonthly
                                                              ? `$${plan.priceMonthly}/mo`
                                                              : 'Custom'}
                                                    </p>
                                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle className="size-3.5 text-green-500" />
                                                            {plan.maxEntities ===
                                                            -1
                                                                ? 'Unlimited'
                                                                : plan.maxEntities?.toLocaleString()}{' '}
                                                            entities
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle className="size-3.5 text-green-500" />
                                                            {plan.maxWorkspaces ===
                                                            -1
                                                                ? 'Unlimited'
                                                                : plan.maxWorkspaces}{' '}
                                                            workspaces
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <CheckCircle className="size-3.5 text-green-500" />
                                                            {plan.maxMembersPerWorkspace ===
                                                            -1
                                                                ? 'Unlimited'
                                                                : plan.maxMembersPerWorkspace}{' '}
                                                            members
                                                        </li>
                                                    </ul>
                                                    {isCurrent ? (
                                                        <Button
                                                            variant="outline"
                                                            className="w-full"
                                                            disabled
                                                        >
                                                            Current Plan
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant={
                                                                (plan.priceMonthly ??
                                                                    0) >
                                                                (currentPlan?.priceMonthly ??
                                                                    0)
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            className="w-full"
                                                            onClick={() =>
                                                                plan.name &&
                                                                selectedWorkspaceId &&
                                                                changePlan.mutate(
                                                                    {
                                                                        params: { path: { workspaceId: selectedWorkspaceId } },
                                                                        body: {
                                                                            planName:
                                                                                plan.name,
                                                                        },
                                                                    },
                                                                )
                                                            }
                                                            disabled={
                                                                changePlan.isPending
                                                            }
                                                        >
                                                            {(plan.priceMonthly ??
                                                                0) >
                                                            (currentPlan?.priceMonthly ??
                                                                0)
                                                                ? 'Upgrade'
                                                                : 'Downgrade'}
                                                        </Button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
