import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { useOpenCustomerPortal } from '@/hooks/billing/useOpenCustomerPortal';
import { useTrialStatus } from '@/hooks/billing/useTrialStatus';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import type { Schemas } from '@/types/api';

const REFETCH_INTERVAL_MS = 60_000;
const WORD_METRIC = 'word_count_monthly';
const TRIAL_WARNING_DAYS = 3;

type BannerKind =
    | 'payment-failed'
    | 'subscription-ended'
    | 'no-subscription-trial-available'
    | 'no-subscription-trial-used'
    | 'trial-ending'
    | 'word-cap-approaching'
    | 'word-cap-over';

interface BannerSpec {
    kind: BannerKind;
    severity: 'warn' | 'error' | 'info';
    message: string;
    ctaLabel: string;
    onCta: () => void;
    dismissible: boolean;
}

export default function BillingBanner() {
    const navigate = useNavigate();
    const { selectedWorkspaceId, dismissedBillingBanner, dismissBillingBanner } =
        useAppStore();
    const portalMutation = useOpenCustomerPortal();

    const { data: subscription, error: subscriptionError } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/subscription',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        {
            enabled: !!selectedWorkspaceId,
            refetchInterval: REFETCH_INTERVAL_MS,
            retry: false, // 404 is a normal state for new workspaces; don't retry.
        },
    );

    const { data: limits } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/limits',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        {
            enabled: !!selectedWorkspaceId,
            refetchInterval: REFETCH_INTERVAL_MS,
        },
    );

    const { data: plans } = $api.useQuery('get', '/billing/plans');
    const { data: trialStatus } = useTrialStatus();

    const openPortal = () => {
        if (!selectedWorkspaceId) return;
        portalMutation.mutate({
            params: { path: { workspaceId: selectedWorkspaceId } },
        });
    };

    const spec = useMemo<BannerSpec | null>(() => {
        const noSubscription =
            !subscription &&
            (subscriptionError as { status?: number } | null)?.status === 404;

        const status = (subscription?.status ?? '').toUpperCase();

        const wordLimit = limits?.find(
            (l: Schemas['LimitCheckResponse']) => l.metric === WORD_METRIC,
        );
        const wordPercent = wordLimit?.percent ?? 0;
        const wordCurrent = wordLimit?.current ?? 0;
        const wordCap = wordLimit?.limit ?? 0;
        const wordOver = !wordLimit?.withinLimit && wordCap > 0;

        // Priority 1 — payment failed (non-dismissible).
        if (status === 'SUSPENDED') {
            return {
                kind: 'payment-failed',
                severity: 'error',
                message:
                    'Your last payment failed. Update your card to restore access.',
                ctaLabel: 'Update payment',
                onCta: openPortal,
                dismissible: false,
            };
        }

        // Priority 2 — subscription ended.
        if (status === 'CANCELLED' || status === 'EXPIRED') {
            return {
                kind: 'subscription-ended',
                severity: 'warn',
                message: 'Your subscription has ended.',
                ctaLabel: 'Resubscribe',
                onCta: () => navigate('/billing'),
                dismissible: true,
            };
        }

        // Priority 3 — no subscription, trial available (post-signup onboarding nudge).
        if (noSubscription && trialStatus?.trialEligible) {
            return {
                kind: 'no-subscription-trial-available',
                severity: 'info',
                message:
                    'Welcome to Headknot — start your 7-day free trial.',
                ctaLabel: 'Choose a plan',
                onCta: () => navigate('/billing'),
                dismissible: true,
            };
        }

        // Priority 4 — no subscription, trial used.
        if (noSubscription && trialStatus && !trialStatus.trialEligible) {
            return {
                kind: 'no-subscription-trial-used',
                severity: 'warn',
                message:
                    'This workspace has no active plan. Pick one to start ingesting.',
                ctaLabel: 'Choose a plan',
                onCta: () => navigate('/billing'),
                dismissible: true,
            };
        }

        // Word cap takes precedence over trial-ending because it actively blocks usage.
        if (wordOver) {
            const overBy = wordCurrent - wordCap;
            return {
                kind: 'word-cap-over',
                severity: 'error',
                message: `You're ${overBy.toLocaleString()} words over this month's limit. Ingest will keep working.`,
                ctaLabel: 'Upgrade plan',
                onCta: () => navigate('/billing'),
                dismissible: true,
            };
        }

        if (wordPercent >= 80 && wordPercent < 100) {
            return {
                kind: 'word-cap-approaching',
                severity: 'warn',
                message: `You're at ${Math.round(wordPercent)}% of your monthly words.`,
                ctaLabel: 'Upgrade plan',
                onCta: () => navigate('/billing'),
                dismissible: true,
            };
        }

        // Priority 5 — trial ending soon.
        if (status === 'ACTIVE' && subscription?.expiresAt) {
            const currentPlan = plans?.find(
                (p: Schemas['PlanResponse']) =>
                    p.id === subscription.planId,
            );
            const trialDays = currentPlan?.trialDays ?? 0;
            const periodEnd = new Date(subscription.expiresAt);
            const daysLeft = differenceInDays(periodEnd, new Date());

            // Treat as trial only when the plan has a trial window and we're inside it.
            const looksLikeTrial = trialDays > 0 && daysLeft <= trialDays;
            if (
                looksLikeTrial &&
                daysLeft >= 0 &&
                daysLeft < TRIAL_WARNING_DAYS
            ) {
                const planLabel =
                    currentPlan?.displayName ?? currentPlan?.name ?? 'trial';
                return {
                    kind: 'trial-ending',
                    severity: 'warn',
                    message: `Your ${planLabel} trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Card on file will be billed automatically — manage anytime.`,
                    ctaLabel: 'Manage billing',
                    onCta: openPortal,
                    dismissible: true,
                };
            }
        }

        return null;
    }, [subscription, subscriptionError, limits, plans, trialStatus, navigate]);

    if (!spec) return null;

    const dismissed =
        dismissedBillingBanner &&
        dismissedBillingBanner.state === spec.kind &&
        dismissedBillingBanner.until > Date.now();
    if (dismissed && spec.dismissible) return null;

    const styles =
        spec.severity === 'error'
            ? 'border-destructive/30 bg-destructive/10 text-destructive'
            : spec.severity === 'warn'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300';

    const Icon =
        spec.severity === 'error'
            ? AlertCircle
            : spec.severity === 'warn'
              ? AlertTriangle
              : Info;

    return (
        <div
            role="alert"
            className={`flex items-center justify-between gap-4 border-b px-4 py-3 text-sm ${styles}`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{spec.message}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Button
                    size="sm"
                    variant={
                        spec.severity === 'error' ? 'destructive' : 'default'
                    }
                    onClick={spec.onCta}
                    disabled={portalMutation.isPending}
                >
                    {portalMutation.isPending ? (
                        <Loader2 className="size-3 animate-spin" />
                    ) : (
                        spec.ctaLabel
                    )}
                </Button>
                {spec.dismissible && (
                    <button
                        type="button"
                        onClick={() => dismissBillingBanner(spec.kind)}
                        className="opacity-70 hover:opacity-100"
                        aria-label="Dismiss"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
