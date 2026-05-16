import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';
import { $api } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { ArrowRight, HelpCircle, CheckIcon, Loader2 } from 'lucide-react';
import { useCreateWorkspace } from '@/hooks/workspace/useCreateWorkspace';
import { useCreateCheckoutSession } from '@/hooks/billing/useCreateCheckoutSession';
import { useSelectFreePlan } from '@/hooks/billing/useSelectFreePlan';
import { useAppStore } from '@/state/store';
import { formatNumber } from '@/lib/format';
import type { Schemas } from '@/types/api';

type Step = 'workspace' | 'plan';
type BillingCycle = 'monthly' | 'yearly';

const PLAN_ORDER = ['free', 'lite', 'pro', 'enterprise'];
const SALES_EMAIL = import.meta.env.VITE_SALES_EMAIL ?? 'sales@headknot.com';

const workspaceSchema = z.object({
    name: z
        .string()
        .min(1, 'Workspace name is required')
        .max(100, 'Workspace name must be 100 characters or less'),
    description: z.string().max(500).optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

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
    const { data: workspaces } = $api.useQuery(
        'get',
        '/workspaces/my-workspaces',
    );

    const [step, setStep] = useState<Step>('workspace');
    const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(
        null,
    );

    // If the user already owns a workspace (e.g. legacy account with no subscription yet, or
    // they refreshed mid-flow), skip Step 1 and jump to plan selection.
    useEffect(() => {
        if (createdWorkspaceId) return;
        const existing =
            selectedWorkspaceId ??
            (workspaces && workspaces.length > 0
                ? workspaces[0]?.id
                : undefined);
        if (existing) {
            if (existing !== selectedWorkspaceId) {
                setSelectedWorkspaceId(existing);
            }
            setCreatedWorkspaceId(existing);
            setStep('plan');
        }
    }, [
        workspaces,
        selectedWorkspaceId,
        createdWorkspaceId,
        setSelectedWorkspaceId,
    ]);

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
                    <span className="text-sm text-gray-400">
                        {step === 'workspace'
                            ? 'Create Workspace'
                            : 'Choose Plan'}
                    </span>
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
                    <StepIndicator step={step} />
                    {step === 'workspace' ? (
                        <WorkspaceStep
                            onCreated={(id) => {
                                setCreatedWorkspaceId(id);
                                setStep('plan');
                            }}
                        />
                    ) : (
                        <PlanStep workspaceId={createdWorkspaceId} />
                    )}
                </div>
            </main>
        </div>
    );
}

function StepIndicator({ step }: { step: Step }) {
    return (
        <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-8 rounded-full bg-purple-500" />
                    <div
                        className={`h-1.5 w-8 rounded-full ${
                            step === 'plan' ? 'bg-purple-500' : 'bg-white/10'
                        }`}
                    />
                </div>
                <span className="text-xs text-gray-400">
                    {step === 'workspace'
                        ? 'Step 1 of 2 — Workspace Setup'
                        : 'Step 2 of 2 — Choose your plan'}
                </span>
            </div>
        </div>
    );
}

function WorkspaceStep({
    onCreated,
}: {
    onCreated: (workspaceId: string) => void;
}) {
    const createWorkspace = useCreateWorkspace();
    const setSelectedWorkspaceId = useAppStore(
        (s) => s.setSelectedWorkspaceId,
    );

    const form = useForm<WorkspaceFormValues>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: { name: '', description: '' },
    });

    async function onSubmit(values: WorkspaceFormValues) {
        createWorkspace.mutate(
            {
                body: {
                    name: values.name,
                    description: values.description || undefined,
                },
            },
            {
                onSuccess: (data: Schemas['WorkspaceResponse']) => {
                    if (data?.id) {
                        setSelectedWorkspaceId(data.id);
                        onCreated(data.id);
                    }
                },
            },
        );
    }

    return (
        <div className="mx-auto max-w-lg">
            <div
                className="rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl"
                style={{ backgroundColor: 'rgba(30, 30, 46, 0.7)' }}
            >
                <h1 className="mb-2 text-2xl font-bold text-white">
                    Create your first workspace
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-gray-400">
                    Workspaces organize your knowledge into separate
                    environments for different projects or teams.
                </p>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-300">
                                        Workspace Name{' '}
                                        <span className="text-red-400">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. My Project"
                                            className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm text-gray-300">
                                        Description{' '}
                                        <span className="text-gray-500">
                                            (optional)
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="A workspace for project collaboration"
                                            rows={3}
                                            className="resize-none border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400"
                            disabled={createWorkspace.isPending}
                        >
                            {createWorkspace.isPending
                                ? 'Creating...'
                                : 'Continue'}
                            {!createWorkspace.isPending && (
                                <ArrowRight className="ml-2 h-4 w-4" />
                            )}
                        </Button>
                    </form>
                </Form>

                {createWorkspace.isError && (
                    <p className="mt-3 text-center text-sm text-red-400">
                        Failed to create workspace. Please try again.
                    </p>
                )}
            </div>
        </div>
    );
}

function PlanStep({ workspaceId }: { workspaceId: string | null }) {
    const navigate = useNavigate();
    const [cycle, setCycle] = useState<BillingCycle>('monthly');

    const { data: plans, isLoading } = $api.useQuery('get', '/billing/plans');
    const checkout = useCreateCheckoutSession();
    const selectFree = useSelectFreePlan();

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
        checkout.mutate({
            params: { path: { workspaceId } },
            body: { priceLookupKey: `${planName}_${cycle}` },
        });
    };

    const handleFree = () => {
        selectFree.mutate(
            { params: { path: { workspaceId } } },
            {
                onSuccess: () => navigate('/'),
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
                            ${price}
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
