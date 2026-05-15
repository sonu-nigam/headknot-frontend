import { useState } from 'react';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useCreateCheckoutSession } from '@/hooks/billing/useCreateCheckoutSession';
import { useOpenCustomerPortal } from '@/hooks/billing/useOpenCustomerPortal';
import { useTrialStatus } from '@/hooks/billing/useTrialStatus';
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
    const { data: trialStatus } = useTrialStatus();
    const checkout = useCreateCheckoutSession();
    const portal = useOpenCustomerPortal();

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

    const order = ['lite', 'pro', 'enterprise'];
    const sortedPlans = [...plans].sort(
        (a, b) => order.indexOf(a.name ?? '') - order.indexOf(b.name ?? ''),
    );

    const hasActiveSubscription = subscription?.status === 'ACTIVE';
    const trialEligible = trialStatus?.trialEligible ?? false;

    const handleCheckout = (planName: string) => {
        if (!selectedWorkspaceId) return;
        checkout.mutate({
            params: { path: { workspaceId: selectedWorkspaceId } },
            body: {
                priceLookupKey: `${planName}_${cycle}`,
                withTrial: trialEligible && !hasActiveSubscription,
            },
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
            <div className="flex items-center justify-between">
                <div>
                    {!hasActiveSubscription && trialEligible && (
                        <p className="text-sm text-muted-foreground">
                            Start any plan with a 7-day free trial. Card
                            required; no charge during the trial.
                        </p>
                    )}
                    {!hasActiveSubscription && !trialEligible && (
                        <p className="text-sm text-muted-foreground">
                            You've used your one-time free trial. Pick a plan
                            to subscribe — billing starts immediately.
                        </p>
                    )}
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        trialEligible={trialEligible}
                        isCheckoutPending={checkout.isPending}
                        isPortalPending={portal.isPending}
                        onCheckout={() => plan.name && handleCheckout(plan.name)}
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
    trialEligible: boolean;
    isCheckoutPending: boolean;
    isPortalPending: boolean;
    onCheckout: () => void;
    onManageInPortal: () => void;
}

function PlanCard({
    plan,
    cycle,
    isCurrent,
    hasActiveSubscription,
    trialEligible,
    isCheckoutPending,
    isPortalPending,
    onCheckout,
    onManageInPortal,
}: PlanCardProps) {
    const isEnterprise = plan.name === 'enterprise';
    const isPro = plan.name === 'pro';
    const recommendForTrial =
        isPro && !hasActiveSubscription && trialEligible;
    const price = cycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const priceSuffix = cycle === 'yearly' ? '/yr' : '/mo';
    const planLabel = plan.displayName ?? plan.name ?? '';
    const trialBadgeVisible =
        !hasActiveSubscription && trialEligible && (plan.trialDays ?? 0) > 0;

    return (
        <Card
            className={`relative ${
                recommendForTrial
                    ? 'ring-2 ring-primary'
                    : isCurrent
                      ? 'border-primary'
                      : ''
            }`}
        >
            {recommendForTrial && (
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
                    ) : (
                        <>
                            <span className="text-2xl font-bold">${price}</span>
                            <span className="text-muted-foreground">
                                {priceSuffix}
                            </span>
                        </>
                    )}
                </div>

                {!isEnterprise && trialBadgeVisible && (
                    <Badge variant="secondary" className="mt-2 w-fit">
                        7-day free trial · Card required
                    </Badge>
                )}
                {!isEnterprise &&
                    !trialEligible &&
                    !hasActiveSubscription && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            You've used your free trial.
                        </p>
                    )}
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
                        } integrations`}
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
                    isEnterprise,
                    isPro,
                    isCurrent,
                    hasActiveSubscription,
                    trialEligible,
                    isCheckoutPending,
                    isPortalPending,
                    onCheckout,
                    onManageInPortal,
                })}
            </CardFooter>
        </Card>
    );
}

interface CtaArgs {
    plan: Schemas['PlanResponse'];
    isEnterprise: boolean;
    isPro: boolean;
    isCurrent: boolean;
    hasActiveSubscription: boolean;
    trialEligible: boolean;
    isCheckoutPending: boolean;
    isPortalPending: boolean;
    onCheckout: () => void;
    onManageInPortal: () => void;
}

function renderCta({
    plan,
    isEnterprise,
    isPro,
    isCurrent,
    hasActiveSubscription,
    trialEligible,
    isCheckoutPending,
    isPortalPending,
    onCheckout,
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

    // User already on a different active plan → plan changes go through Customer Portal so
    // Stripe handles proration and downgrade rules.
    if (hasActiveSubscription) {
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

    // No active subscription — first subscribe (with or without trial).
    const trialAvailable = trialEligible && (plan.trialDays ?? 0) > 0;
    const label = trialAvailable
        ? isPro
            ? 'Start 7-day free trial'
            : `Start trial on ${planLabel}`
        : `Subscribe to ${planLabel}`;

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
                label
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
