import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { handleGoogleOAuthCallback, storage } from '@workspace/api-client';
import { useDebounceFn } from 'ahooks';
import { AppHeader } from '@/components/app-header';

export default function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Google Callback' },
    ];

    const googleLogin = useMutation({
        mutationFn: async ({
            code,
            state,
        }: {
            code: string;
            state: string;
        }) => {
            return await handleGoogleOAuthCallback(code, state);
        },
    });

    // Extract values only once from searchParams
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    const handleGoogleLogin = () => {
        const next = sessionStorage.getItem('oauth_next') || '/';
        if (!code || !state) return;
        googleLogin.mutate(
            { code, state },
            {
                onSuccess: (data) => {
                    sessionStorage.removeItem('oauth_state');
                    sessionStorage.removeItem('oauth_next');
                    if (data.accessToken) {
                        storage.access = data.accessToken;
                        storage.refresh = data.refreshToken;
                    }
                    setTimeout(() => {
                        window.location.href = next;
                    }, 100);
                },
                onError: (error) => {
                    console.error('Google login failed:', error);
                    navigate('/login?error=oauth_failed', { replace: true });
                },
            },
        );
    };

    const handleGoogleLoginDebounced = useDebounceFn(handleGoogleLogin, {
        wait: 500,
    });

    useEffect(() => {
        // Avoid running if no query params
        if (!code && !error && !state) return;

        if (googleLogin.isPending || googleLogin.isSuccess) return;

        // if (hasEffectRun.current) return;

        // Handle OAuth errors
        if (error) {
            console.error('Google OAuth error:', error);
            navigate('/login?error=oauth_failed', { replace: true });
            return;
        }

        // If no code or state, redirect to login
        if (!code || !state) {
            console.error('Missing code or state parameter');
            navigate('/login', { replace: true });
            return;
        }

        // Verify state matches stored value
        const storedState = sessionStorage.getItem('oauth_state');
        if (!storedState || storedState !== state) {
            console.error('State mismatch - possible CSRF attack');
            navigate('/login?error=oauth_failed', { replace: true });
            return;
        }

        handleGoogleLoginDebounced.run();
    }, [code, error, state, navigate]);

    return (
        <>
            <AppHeader breadcrumbs={breadcrumbs} />
            <div className="min-h-screen grid place-items-center">
                <div className="text-center">
                    {}
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Completing sign in with Google...
                    </p>
                </div>
            </div>
        </>
    );
}
