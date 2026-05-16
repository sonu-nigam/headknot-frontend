import { useState } from 'react';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useCreateCheckoutSession } from '@/hooks/billing/useCreateCheckoutSession';
import { useOpenCustomerPortal } from '@/hooks/billing/useOpenCustomerPortal';
import { useSelectFreePlan } from '@/hooks/billing/useSelectFreePlan';
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
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { CheckIcon, Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import type { Schemas } from '@/types/api';

type BillingCycle = 'monthly' | 'yearly';

const SALES_EMAIL = import.meta.env.VITE_SALES_EMAIL ?? 'sales@headknot.com';
const PLAN_ORDER = ['free', 'lite', 'pro', 'enterprise'];

export function Plans() {
    const { selectedWorkspaceId } = useAppStore();
    const [cycle, setCycle] = useState<BillingCycle>('monthly');

    const { data: plans, isLoading } = $api.useQuery('get', '/billing/plans');
    const { data: subscription } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/subscription',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );
    const checkout = useCreateCheckoutSession();
    const portal = useOpenCustomerPortal();
    const selectFree = useSelectFreePlan();

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading plans...
                </CardContent>
            </Card>
        );
    }

    if (!plans?.length) {
        return (
            <Card>
                <CardContent className="p-6">No plans available.</CardContent>
            </Card>
        );
    }

    const sortedPlans = [...plans].sort(
        (a, b) =>
            PLAN_ORDER.indexOf(a.name ?? '') -
            PLAN_ORDER.indexOf(b.name ?? ''),
    );
    const hasActiveSubscription = subscription?.status === 'ACTIVE';

    const handleCheckout = (planName: string) => {
        if (!selectedWorkspaceId) return;
        checkout.mutate({
            params: { path: { workspaceId: selectedWorkspaceId } },
            body: { priceLookupKey: `${planName}_${cycle}` },
        });
    };

    const handleSelectFree = () => {
        if (!selectedWorkspaceId) return;
        selectFree.mutate({
            params: { path: { workspaceId: selectedWorkspaceId } },
        });
    };

    const handleManageInPortal = () => {
        if (!selectedWorkspaceId) return;
        portal.mutate({
            params: { path: { workspaceId: selectedWorkspaceId } },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <Tabs
                    value={cycle}
                    onValueChange={(v) => setCycle(v as BillingCycle)}
                >
                    <TabsList>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">
                            Yearly{' '}
                            <span className="ml-1 text-xs text-muted-foreground">
                                Save 17%
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedPlans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        cycle={cycle}
                        isCurrent={
                            plan.id === subscription?.planId &&
                            subscription?.status === 'ACTIVE'
                        }
                        hasActiveSubscription={hasActiveSubscription}
                        isCheckoutPending={checkout.isPending}
                        isPortalPending={portal.isPending}
                        isSelectFreePending={selectFree.isPending}
                        onCheckout={() =>
                            plan.name && handleCheckout(plan.name)
                        }
                        onSelectFree={handleSelectFree}
                        onManageInPortal={handleManageInPortal}
                    />
                ))}
            </div>
        </div>
    );
}

interface PlanCardProps {
    plan: Schemas['PlanResponse'];
    cycle: BillingCycle;
    isCurrent: boolean;
    hasActiveSubscription: boolean;
    isCheckoutPending: boolean;
    isPortalPending: boolean;
    isSelectFreePending: boolean;
    onCheckout: () => void;
    onSelectFree: () => void;
    onManageInPortal: () => void;
}

function PlanCard({
    plan,
    cycle,
    isCurrent,
    hasActiveSubscription,
    isCheckoutPending,
    isPortalPending,
    isSelectFreePending,
    onCheckout,
    onSelectFree,
    onManageInPortal,
}: PlanCardProps) {
    const isFree = plan.name === 'free';
    const isEnterprise = plan.name === 'enterprise';
    const isPro = plan.name === 'pro';
    const price = cycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const priceSuffix = cycle === 'yearly' ? '/yr' : '/mo';
    const planLabel = plan.displayName ?? plan.name ?? '';

    return (
        <Card
            className={`relative ${
                isPro
                    ? 'ring-2 ring-primary'
                    : isCurrent
                      ? 'border-primary'
                      : ''
            }`}
        >
            {isPro && !isCurrent && (
                <Badge className="absolute -top-2 right-4">Recommended</Badge>
            )}

            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{planLabel}</CardTitle>
                    {isCurrent && <Badge variant="secondary">Current</Badge>}
                </div>
                {plan.description && (
                    <CardDescription>{plan.description}</CardDescription>
                )}

                <div className="pt-2">
                    {isEnterprise || price == null ? (
                        <span className="text-2xl font-bold">
                            Contact sales
                        </span>
                    ) : isFree ? (
                        <span className="text-2xl font-bold">Free</span>
                    ) : (
                        <>
                            <span className="text-2xl font-bold">${price}</span>
                            <span className="text-muted-foreground">
                                {priceSuffix}
                            </span>
                        </>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <ul className="space-y-2 text-sm">
                    <Feature
                        label={`${
                            plan.maxWordsMonthly === -1
                                ? 'Unlimited'
                                : formatNumber(plan.maxWordsMonthly ?? 0)
                        } words/month`}
                    />
                    <Feature
                        label={`${
                            plan.maxWorkspaces === -1
                                ? 'Unlimited'
                                : plan.maxWorkspaces
                        } workspaces`}
                    />
                    <Feature
                        label={`${
                            plan.maxMembersPerWorkspace === -1
                                ? 'Unlimited'
                                : plan.maxMembersPerWorkspace
                        } members per workspace`}
                    />
                    <Feature
                        label={`${
                            plan.maxIntegrations === -1
                                ? 'Unlimited'
                                : plan.maxIntegrations
                        } integration${plan.maxIntegrations === 1 ? '' : 's'}`}
                    />
                    <Feature
                        label={`${
                            plan.auditRetentionDays === -1
                                ? 'Unlimited'
                                : `${plan.auditRetentionDays}-day`
                        } audit log retention`}
                    />
                    {plan.auditExportEnabled && (
                        <Feature label="Audit log export" />
                    )}
                    {plan.ssoEnabled && <Feature label="SSO / SAML sign-in" />}
                </ul>
            </CardContent>

            <CardFooter>
                {renderCta({
                    plan,
                    isFree,
                    isEnterprise,
                    isPro,
                    isCurrent,
                    hasActiveSubscription,
                    isCheckoutPending,
                    isPortalPending,
                    isSelectFreePending,
                    onCheckout,
                    onSelectFree,
                    onManageInPortal,
                })}
            </CardFooter>
        </Card>
    );
}

interface CtaArgs {
    plan: Schemas['PlanResponse'];
    isFree: boolean;
    isEnterprise: boolean;
    isPro: boolean;
    isCurrent: boolean;
    hasActiveSubscription: boolean;
    isCheckoutPending: boolean;
    isPortalPending: boolean;
    isSelectFreePending: boolean;
    onCheckout: () => void;
    onSelectFree: () => void;
    onManageInPortal: () => void;
}

function renderCta({
    plan,
    isFree,
    isEnterprise,
    isPro,
    isCurrent,
    hasActiveSubscription,
    isCheckoutPending,
    isPortalPending,
    isSelectFreePending,
    onCheckout,
    onSelectFree,
    onManageInPortal,
}: CtaArgs) {
    const planLabel = plan.displayName ?? plan.name ?? '';

    if (isEnterprise) {
        return (
            <Button asChild className="w-full" variant="outline">
                <a href={`mailto:${SALES_EMAIL}`}>Contact Sales</a>
            </Button>
        );
    }

    if (isCurrent) {
        return (
            <Button className="w-full" variant="outline" disabled>
                Current Plan
            </Button>
        );
    }

    // Already on a paid plan → upgrades/downgrades go through the Customer Portal so Stripe owns
    // proration. Free has no portal path; switching off Free requires Checkout for a paid plan.
    if (hasActiveSubscription && !isFree) {
        return (
            <Button
                className="w-full"
                variant={isPro ? 'default' : 'outline'}
                onClick={onManageInPortal}
                disabled={isPortalPending}
            >
                {isPortalPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    `Switch to ${planLabel}`
                )}
            </Button>
        );
    }

    if (isFree) {
        if (hasActiveSubscription) {
            return (
                <Button className="w-full" variant="outline" disabled>
                    Downgrade via support
                </Button>
            );
        }
        return (
            <Button
                className="w-full"
                variant="outline"
                onClick={onSelectFree}
                disabled={isSelectFreePending}
            >
                {isSelectFreePending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Get started'
                )}
            </Button>
        );
    }

    return (
        <Button
            className="w-full"
            variant={isPro ? 'default' : 'outline'}
            onClick={onCheckout}
            disabled={isCheckoutPending}
        >
            {isCheckoutPending ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                `Subscribe to ${planLabel}`
            )}
        </Button>
    );
}

function Feature({ label }: { label: string }) {
    return (
        <li className="flex items-center gap-2">
            <CheckIcon className="size-4 text-green-500 shrink-0" />
            <span>{label}</span>
        </li>
    );
}
