import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { Schemas } from '@/types/api';

const REFETCH_INTERVAL_MS = 60_000;
const WORD_METRIC = 'word_count_monthly';

type BannerKind =
    | 'payment-failed'
    | 'subscription-ended'
    | 'no-subscription'
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
                    'Your last payment failed. Choose a plan to restore access.',
                ctaLabel: 'Update payment',
                onCta: () => navigate('/billing'),
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

        // Priority 3 — no subscription yet (workspace created but plan not selected).
        if (noSubscription) {
            return {
                kind: 'no-subscription',
                severity: 'info',
                message:
                    'Pick a plan to start ingesting. Free includes 50K words/month.',
                ctaLabel: 'Choose a plan',
                onCta: () => navigate('/billing'),
                dismissible: true,
            };
        }

        // Word cap — hard-blocked once over (backend now returns 402); banner mirrors that.
        if (wordOver) {
            const overBy = wordCurrent - wordCap;
            return {
                kind: 'word-cap-over',
                severity: 'error',
                message: `You're ${overBy.toLocaleString()} words over this month's limit. Upgrade to keep ingesting.`,
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

        return null;
    }, [subscription, subscriptionError, limits, navigate]);

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
                >
                    {spec.ctaLabel}
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
