import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import type { Schemas } from '@/types/api';

const WORD_METRIC = 'word_count_monthly';

export function Usage() {
    const { selectedWorkspaceId } = useAppStore();
    const { data: limits, isLoading } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/limits',
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading usage data...
                </CardContent>
            </Card>
        );
    }

    if (!limits || limits.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No usage data available yet.
                </CardContent>
            </Card>
        );
    }

    const wordLimit = limits.find(
        (l: Schemas['LimitCheckResponse']) => l.metric === WORD_METRIC,
    );
    const otherLimits = limits.filter(
        (l: Schemas['LimitCheckResponse']) => l.metric !== WORD_METRIC,
    );

    return (
        <div className="space-y-4">
            {wordLimit && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {wordLimit.displayName ?? 'Words this month'}
                        </CardTitle>
                        <CardDescription>
                            Words counted across all ingested content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LimitBar limit={wordLimit} prominent />
                    </CardContent>
                </Card>
            )}

            {otherLimits.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Plan limits</CardTitle>
                        <CardDescription>
                            Other resources counted against your plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {otherLimits.map(
                            (limit: Schemas['LimitCheckResponse']) => (
                                <LimitBar key={limit.metric} limit={limit} />
                            ),
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function LimitBar({
    limit,
    prominent = false,
}: {
    limit: Schemas['LimitCheckResponse'];
    prominent?: boolean;
}) {
    const isUnlimited = limit.limit === -1;
    const current = limit.current ?? 0;
    const limitValue = limit.limit ?? 0;
    const percent = isUnlimited ? 0 : Math.min(limit.percent ?? 0, 100);
    const isOverLimit = !isUnlimited && !limit.withinLimit;
    const remaining = limit.remaining ?? 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className={prominent ? 'font-medium' : ''}>
                    {limit.displayName ?? limit.metric}
                </span>
                <span className="font-mono text-muted-foreground">
                    {formatNumber(current)} /{' '}
                    {isUnlimited ? 'Unlimited' : formatNumber(limitValue)}
                </span>
            </div>
            {!isUnlimited && (
                <div
                    className={`rounded-full bg-muted overflow-hidden ${
                        prominent ? 'h-3' : 'h-2'
                    }`}
                >
                    <div
                        className={`h-full rounded-full transition-all ${
                            isOverLimit
                                ? 'bg-destructive'
                                : percent > 80
                                  ? 'bg-yellow-500'
                                  : 'bg-primary'
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            )}
            {!isUnlimited && (
                <p className="text-xs text-muted-foreground text-right">
                    {isOverLimit
                        ? `Over by ${formatNumber(current - limitValue)}`
                        : `${formatNumber(remaining)} left`}
                </p>
            )}
        </div>
    );
}
