import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { $api } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import { HelpCircle, CheckIcon, Loader2 } from 'lucide-react';
import { useRazorpayCheckout } from '@/hooks/billing/useRazorpayCheckout';
import { useSelectFreePlan } from '@/hooks/billing/useSelectFreePlan';
import { useCompleteOnboarding } from '@/hooks/onboarding/useCompleteOnboarding';
import { useAppStore } from '@/state/store';
import { formatNumber, formatPrice } from '@/lib/format';
import type { Schemas } from '@/types/api';

type BillingCycle = 'monthly' | 'yearly';

const PLAN_ORDER = ['free', 'lite', 'pro', 'enterprise'];
const SALES_EMAIL = import.meta.env.VITE_SALES_EMAIL ?? 'sales@headknot.com';

function DotGridPattern() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dot-grid-onboarding"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(124,58,237,0.15)" />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#dot-grid-onboarding)"
            />
        </svg>
    );
}

export default function OnboardingPage() {
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const setSelectedWorkspaceId = useAppStore(
        (s) => s.setSelectedWorkspaceId,
    );
    const { data: workspaces, isLoading } = $api.useQuery(
        'get',
        '/workspaces/my-workspaces',
    );

    // The backend auto-creates a default workspace on signup, so onboarding is purely plan
    // selection — there is no workspace-creation step. Use the selected (or first) workspace.
    const workspaceId = selectedWorkspaceId ?? workspaces?.[0]?.id ?? null;

    useEffect(() => {
        if (workspaceId && workspaceId !== selectedWorkspaceId) {
            setSelectedWorkspaceId(workspaceId);
        }
    }, [workspaceId, selectedWorkspaceId, setSelectedWorkspaceId]);

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-hidden"
            style={{ backgroundColor: '#0d0d1c' }}
        >
            <DotGridPattern />
            <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                        Headknot
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-sm text-gray-400">Choose Plan</span>
                </div>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-300"
                    title="Help"
                >
                    <HelpCircle className="h-5 w-5" />
                </button>
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
                <div className="w-full max-w-5xl">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                            <Loader2 className="size-4 animate-spin" />
                            Loading…
                        </div>
                    ) : (
                        <PlanStep workspaceId={workspaceId} />
                    )}
                </div>
            </main>
        </div>
    );
}

function PlanStep({ workspaceId }: { workspaceId: string | null }) {
    const navigate = useNavigate();
    const [cycle, setCycle] = useState<BillingCycle>('monthly');
    const completeOnboarding = useCompleteOnboarding();

    // Record onboarding completion (server-side) BEFORE leaving. The route guard gates on that
    // flag, so navigating before it's persisted would bounce the user straight back to /onboarding.
    const finish = async () => {
        try {
            await completeOnboarding.mutateAsync({});
        } finally {
            navigate('/');
        }
    };

    const { data: plans, isLoading } = $api.useQuery('get', '/billing/plans');
    const checkout = useRazorpayCheckout({ onSuccess: finish });
    const selectFree = useSelectFreePlan();

    // Self-heal: if this workspace already has a subscription (e.g. the user paid but closed the
    // tab before completion was recorded), finish onboarding instead of asking them to pick a plan
    // again — selecting a plan now would 409.
    const { data: existingSubscription } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/subscription',
        { params: { path: { workspaceId: workspaceId ?? '' } } },
        { enabled: !!workspaceId, retry: false },
    );
    const healedRef = useRef(false);
    useEffect(() => {
        if (existingSubscription && !healedRef.current) {
            healedRef.current = true;
            void finish();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingSubscription]);

    if (!workspaceId) {
        return (
            <p className="text-center text-sm text-red-400">
                Missing workspace context. Refresh to retry.
            </p>
        );
    }

    if (isLoading || !plans?.length) {
        return (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Loader2 className="size-4 animate-spin" />
                Loading plans...
            </div>
        );
    }

    const sortedPlans = [...plans].sort(
        (a, b) =>
            PLAN_ORDER.indexOf(a.name ?? '') -
            PLAN_ORDER.indexOf(b.name ?? ''),
    );

    const handlePaid = (planName: string) => {
        checkout.startCheckout({
            workspaceId,
            priceLookupKey: `${planName}_${cycle}`,
        });
    };

    const handleFree = () => {
        selectFree.mutate(
            { params: { path: { workspaceId } } },
            {
                onSuccess: () => {
                    void finish();
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Choose your plan
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Start free, or pick a paid plan with higher limits.
                    </p>
                </div>
                <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 text-sm text-gray-300">
                    <button
                        type="button"
                        onClick={() => setCycle('monthly')}
                        className={`px-3 py-1.5 rounded-md ${
                            cycle === 'monthly'
                                ? 'bg-purple-500 text-white'
                                : ''
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => setCycle('yearly')}
                        className={`px-3 py-1.5 rounded-md ${
                            cycle === 'yearly'
                                ? 'bg-purple-500 text-white'
                                : ''
                        }`}
                    >
                        Yearly · Save 17%
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedPlans.map((plan) => (
                    <OnboardingPlanCard
                        key={plan.id}
                        plan={plan}
                        cycle={cycle}
                        isFreePending={selectFree.isPending}
                        isCheckoutPending={checkout.isPending}
                        onSelectFree={handleFree}
                        onSelectPaid={() =>
                            plan.name && handlePaid(plan.name)
                        }
                    />
                ))}
            </div>
        </div>
    );
}

function OnboardingPlanCard({
    plan,
    cycle,
    isFreePending,
    isCheckoutPending,
    onSelectFree,
    onSelectPaid,
}: {
    plan: Schemas['PlanResponse'];
    cycle: BillingCycle;
    isFreePending: boolean;
    isCheckoutPending: boolean;
    onSelectFree: () => void;
    onSelectPaid: () => void;
}) {
    const isFree = plan.name === 'free';
    const isEnterprise = plan.name === 'enterprise';
    const isPro = plan.name === 'pro';
    const price = cycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const priceSuffix = cycle === 'yearly' ? '/yr' : '/mo';

    return (
        <div
            className={`flex flex-col rounded-2xl border p-6 shadow-2xl backdrop-blur-xl ${
                isPro
                    ? 'border-purple-500/60 ring-2 ring-purple-500/40'
                    : 'border-white/10'
            }`}
            style={{ backgroundColor: 'rgba(30, 30, 46, 0.7)' }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                    {plan.displayName ?? plan.name}
                </h3>
                {isPro && (
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                        Recommended
                    </span>
                )}
            </div>

            <div className="mt-2 text-xs text-gray-400">{plan.description}</div>

            <div className="mt-4">
                {isEnterprise ? (
                    <span className="text-2xl font-bold text-white">
                        Contact sales
                    </span>
                ) : isFree ? (
                    <span className="text-2xl font-bold text-white">Free</span>
                ) : (
                    <>
                        <span className="text-2xl font-bold text-white">
                            {formatPrice(Number(price), plan.currency)}
                        </span>
                        <span className="text-gray-400">{priceSuffix}</span>
                    </>
                )}
            </div>

            <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                    <CheckIcon className="size-4 text-green-400 shrink-0" />
                    {plan.maxWordsMonthly === -1
                        ? 'Unlimited'
                        : formatNumber(plan.maxWordsMonthly ?? 0)}{' '}
                    words/month
                </li>
                <li className="flex items-center gap-2">
                    <CheckIcon className="size-4 text-green-400 shrink-0" />
                    {plan.maxIntegrations === -1
                        ? 'Unlimited'
                        : plan.maxIntegrations}{' '}
                    integration{plan.maxIntegrations === 1 ? '' : 's'}
                </li>
                <li className="flex items-center gap-2">
                    <CheckIcon className="size-4 text-green-400 shrink-0" />
                    {plan.maxMembersPerWorkspace === -1
                        ? 'Unlimited'
                        : plan.maxMembersPerWorkspace}{' '}
                    member
                    {plan.maxMembersPerWorkspace === 1 ? '' : 's'} per workspace
                </li>
                {plan.auditExportEnabled && (
                    <li className="flex items-center gap-2">
                        <CheckIcon className="size-4 text-green-400 shrink-0" />
                        Audit log export
                    </li>
                )}
                {plan.ssoEnabled && (
                    <li className="flex items-center gap-2">
                        <CheckIcon className="size-4 text-green-400 shrink-0" />
                        SSO / SAML
                    </li>
                )}
            </ul>

            <div className="mt-6">
                {isEnterprise ? (
                    <Button
                        asChild
                        className="w-full"
                        variant="outline"
                    >
                        <a href={`mailto:${SALES_EMAIL}`}>Contact sales</a>
                    </Button>
                ) : isFree ? (
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={onSelectFree}
                        disabled={isFreePending}
                    >
                        {isFreePending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            'Get started'
                        )}
                    </Button>
                ) : (
                    <Button
                        className={`w-full ${
                            isPro
                                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400'
                                : ''
                        }`}
                        variant={isPro ? 'default' : 'outline'}
                        onClick={onSelectPaid}
                        disabled={isCheckoutPending}
                    >
                        {isCheckoutPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            `Subscribe to ${plan.displayName ?? plan.name}`
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
