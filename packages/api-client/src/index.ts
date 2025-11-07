import createClient, {
    type Middleware,
    type ClientMethod,
} from 'openapi-fetch';
export type { paths, components };

const baseUrl = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE;

export const storage = {
    get access() {
        return localStorage.getItem('accessToken') ?? undefined;
    },
    set access(t) {
        t
            ? localStorage.setItem('accessToken', t)
            : localStorage.removeItem('accessToken');
    },
    get refresh() {
        return localStorage.getItem('refreshToken') ?? undefined;
    },
    set refresh(t) {
        t
            ? localStorage.setItem('refreshToken', t)
            : localStorage.removeItem('refreshToken');
    },
    clear() {
        this.access = undefined;
        this.refresh = undefined;
    },
};

// If you want a custom fetch (e.g., add credentials), define it and capture in closure:
const baseFetch: typeof fetch = (url, init) =>
    fetch(url, { /* credentials: 'include', */ ...init });

const authMiddleware: Middleware = {
    async onRequest({ request }) {
        const token = storage.access;
        if (!token) return;

        const headers = new Headers(request.headers);
        headers.set('Authorization', `Bearer ${token}`);
        return new Request(request, { headers });
    },

    // NOTE: no 'fetch' param here; use global fetch or baseFetch from closure
    async onResponse({ response, request }) {
        if (response.status !== 401) return;
        if ((request as any)._retried) return;

        const rt = storage.refresh;
        if (!rt) return;

        const refreshRes = await baseFetch(`${baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rt }),
        });

        if (!refreshRes.ok) {
            storage.clear();
            return; // bubble original 401
        }

        const { accessToken, refreshToken } = await refreshRes.json();
        if (accessToken) storage.access = accessToken;
        if (refreshToken) storage.refresh = refreshToken;

        const headers = new Headers(request.headers);
        headers.set('Authorization', `Bearer ${storage.access!}`);

        const retryReq = new Request(request, { headers });
        (retryReq as any)._retried = true;

        return baseFetch(retryReq); // ✅ return a Response (Promise<Response>)
    },
};

export const api = createClient<paths>({
    baseUrl,
    fetch: baseFetch, // optional, but nice if you want consistent behavior
});

api.use(authMiddleware);

// Helper for Google OAuth (Legacy - Deprecated)
// @deprecated Use initiateGoogleOAuth and handleGoogleOAuthCallback instead
export async function googleAuth(code: string) {
    const response = await baseFetch(`${baseUrl}/auth/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: 'Google authentication failed' }));
        throw new Error(error.message || 'Google authentication failed');
    }

    const data = (await response.json()) as {
        accessToken: string;
        refreshToken: string;
    };

    return data;
}

// Helper for Google OAuth PKCE - Initiate flow
export async function initiateGoogleOAuth() {
    const { data, error } = await api.POST('/auth/oauth/google/initiate');

    if (error) {
        throw new Error('Failed to initiate Google OAuth');
    }

    return data;
}

// Helper for Google OAuth PKCE - Handle callback
export async function handleGoogleOAuthCallback(code: string, state: string) {
    const { data, error } = await api.POST('/auth/oauth/google/callback', {
        body: { code, state },
    });

    if (error) {
        throw new Error('Failed to complete Google OAuth');
    }

    return data;
}
