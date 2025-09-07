import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const loc = useLocation();

    // Fast user check; Spring should read cookie and return user or 401
    const { data: user, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: () => api<{ id: string; email: string }>('/bff/auth/me'),
    });

    if (isLoading) return <div className="p-6">Checking session…</div>;
    if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />;

    return <>{children}</>;
}
