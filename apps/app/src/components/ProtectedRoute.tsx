import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { $api } from '@workspace/api-client';

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const loc = useLocation();

    const { data: userProfileData, isLoading: profileLoading } = $api.useQuery(
        'get',
        '/profile/me',
    );

    const isOnOnboarding = loc.pathname === '/onboarding';
    const authed = !!userProfileData;

    // Onboarding completion is an explicit, persisted flag on the user. Gate on it so a user who
    // hasn't finished onboarding is sent back to it on every login. Skip while ON /onboarding
    // (that page is the redirect destination) and until auth is confirmed. The OnboardingPage
    // resumes the correct step (workspace vs plan) from its own queries.
    const { data: onboarding, isLoading: onboardingLoading } = $api.useQuery(
        'get',
        '/onboarding/status',
        undefined,
        { enabled: authed && !isOnOnboarding },
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

    if (onboardingLoading) return <div className="p-6">Loading…</div>;
    if (!onboarding?.completed) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
