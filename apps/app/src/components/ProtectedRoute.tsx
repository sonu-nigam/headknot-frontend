import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const loc = useLocation();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: userProfileData, isLoading: profileLoading } = $api.useQuery(
        'get',
        '/profile/me',
    );

    const isOnOnboarding = loc.pathname === '/onboarding';
    const authed = !!userProfileData;

    // Probe ownership of any workspace, plus the selected workspace's subscription state. Skip
    // while on /onboarding (the page itself is the destination of the redirect) and while we
    // haven't confirmed auth yet.
    const { data: workspaces, isLoading: workspacesLoading } = $api.useQuery(
        'get',
        '/workspaces/my-workspaces',
        undefined,
        { enabled: authed && !isOnOnboarding },
    );

    const hasWorkspace = (workspaces?.length ?? 0) > 0;
    const effectiveWorkspaceId =
        selectedWorkspaceId ??
        (workspaces && workspaces.length > 0 ? workspaces[0]?.id : undefined);

    const { data: subscription, isLoading: subscriptionLoading } = $api.useQuery(
        'get',
        '/billing/workspace/{workspaceId}/subscription',
        { params: { path: { workspaceId: effectiveWorkspaceId ?? '' } } },
        {
            enabled: authed && !isOnOnboarding && !!effectiveWorkspaceId,
            retry: false, // 404 is "no subscription"; not worth retrying.
        },
    );

    if (profileLoading) return <div className="p-6">Checking session…</div>;
    if (!authed) {
        return (
            <Navigate
                to={`/login?next=${encodeURIComponent(loc.pathname)}`}
                replace
            />
        );
    }

    if (isOnOnboarding) {
        return <>{children}</>;
    }

    if (workspacesLoading) return <div className="p-6">Loading…</div>;
    if (!hasWorkspace) {
        return <Navigate to="/onboarding" replace />;
    }

    // Have at least one workspace — force plan selection if the active one has no subscription
    // yet. The subscription endpoint returns 404 for workspaces created pre-plan-pick. The query
    // result `subscription` is undefined in that case while `isLoading` is false; we treat that
    // as "needs onboarding step 2".
    if (subscriptionLoading) return <div className="p-6">Loading…</div>;
    if (!subscription) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
