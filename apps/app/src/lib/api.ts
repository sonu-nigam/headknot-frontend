export async function api<T>(
    path: string,
    init?: RequestInit,
    { retryRefresh = true }: { retryRefresh?: boolean } = {}
): Promise<T> {
    const res = await fetch(path, { credentials: 'include', ...init });
    if (res.status === 401) {
        // Optional: try refresh on JWT setups
        if (retryRefresh) {
            const rr = await fetch('/bff/auth/refresh', { credentials: 'include' });
            if (rr.ok) return api<T>(path, init, { retryRefresh: false });
        }
        // Opaque session or refresh failed → redirect to login
        if (typeof window !== 'undefined') {
            const next = encodeURIComponent(location.pathname + location.search);
            window.location.href = `/login?next=${next}`;
        }
        throw new Error('Unauthenticated');
    }
    if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'Request failed');
    }
    return res.json();
}
