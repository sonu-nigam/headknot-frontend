import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { profileQueryOptions } from '@/query/options/profile';

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const loc = useLocation();

    const { data: userProfileData, isLoading } = useQuery(profileQueryOptions);

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
