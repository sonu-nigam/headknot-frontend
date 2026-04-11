import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { $api } from '@workspace/api-client';

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const loc = useLocation();

    const { data: userProfileData, isLoading } = $api.useQuery("get", "/profile/me");

    if (isLoading) return <div className="p-6">Checking session…</div>;
    if (!userProfileData)
        return (
            <Navigate
                to={`/login?next=${encodeURIComponent(loc.pathname)}`}
                replace
            />
        );

    return <>{children}</>;
}
