import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';

export function Usage() {
    const { selectedWorkspaceId } = useAppStore();
    const { data: usage, isLoading: usageLoading } = $api.useQuery(
        "get", "/billing/workspace/{workspaceId}/usage",
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );
    const { data: limits, isLoading: limitsLoading } = $api.useQuery(
        "get", "/billing/workspace/{workspaceId}/limits",
        { params: { path: { workspaceId: selectedWorkspaceId ?? '' } } },
        { enabled: !!selectedWorkspaceId },
    );

    const isLoading = usageLoading || limitsLoading;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    Loading usage data...
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {limits && limits.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Limits</CardTitle>
                        <CardDescription>
                            Your current usage against plan limits.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {limits.map((limit) => {
                            const isUnlimited = limit.limit === -1;
                            const percentage = isUnlimited
                                ? 0
                                : limit.limit && limit.limit > 0
                                  ? Math.min(
                                        ((limit.current ?? 0) / limit.limit) *
                                            100,
                                        100
                                    )
                                  : 0;
                            const isOverLimit =
                                !isUnlimited && !limit.withinLimit;

                            return (
                                <div key={limit.metric} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="capitalize">
                                            {limit.metric?.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {limit.current ?? 0} /{' '}
                                            {isUnlimited
                                                ? 'Unlimited'
                                                : limit.limit}
                                        </span>
                                    </div>
                                    {!isUnlimited && (
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isOverLimit
                                                        ? 'bg-destructive'
                                                        : percentage > 80
                                                          ? 'bg-yellow-500'
                                                          : 'bg-primary'
                                                }`}
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {usage && usage.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Metrics</CardTitle>
                        <CardDescription>
                            Detailed resource usage for this workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {usage.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm border-b pb-2 last:border-0"
                                >
                                    <span className="capitalize">
                                        {item.metric?.replace(/_/g, ' ')}
                                    </span>
                                    <span className="font-medium">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {(!limits || limits.length === 0) &&
                (!usage || usage.length === 0) && (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No usage data available yet.
                        </CardContent>
                    </Card>
                )}
        </div>
    );
}
