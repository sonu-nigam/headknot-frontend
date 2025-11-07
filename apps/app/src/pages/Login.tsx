import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '@/forms/AuthForm/LoginForm';
import { LoginFormValues } from '@/validations/form/authForm';
import { useMutation } from '@tanstack/react-query';
import { api, storage } from '@workspace/api-client';
import { useCallback } from 'react';
import { Schemas } from '@/types/api';

export default function Login() {
    const [sp] = useSearchParams();
    const next = sp.get('next') || '/';
    const login = useMutation({
        mutationFn: async ({ username, password }: LoginFormValues) => {
            const { error, data } = await api.POST('/auth/login', {
                body: { username, password },
            });
            if (error) throw error;
            return data;
        },
    });

    const initiateGoogleOAuth = useMutation<Schemas['OAuthAuthorizeResponse']>({
        mutationFn: async () => {
            const { error, data } = await api.POST(
                '/auth/oauth/google/initiate',
            );
            if (error) throw error;
            return data;
        },
    });

    async function onSubmit(values: LoginFormValues) {
        login.mutate(
            {
                username: values.username,
                password: values.password,
            },
            {
                onError: (error) => {
                    // window.location.href = next;
                },
                onSuccess: (data) => {
                    storage.access = data.accessToken;
                    storage.refresh = data.refreshToken;
                    window.location.href = next;
                },
            },
        );
    }

    const handleGoogleLogin = useCallback(async () => {
        try {
            // Call backend to initiate PKCE OAuth flow
            const response = await initiateGoogleOAuth.mutateAsync();

            if (!response.authorizationUrl || !response.state) {
                console.error('Invalid response from OAuth initiate endpoint');
                return;
            }

            // Store the state and next path for callback verification
            sessionStorage.setItem('oauth_state', response.state);
            sessionStorage.setItem('oauth_next', next);

            // Redirect to Google authorization URL
            window.location.href = response.authorizationUrl;
        } catch (error) {
            console.error('Failed to initiate Google OAuth:', error);
        }
    }, [next]);

    return (
        <div className="min-h-screen grid place-items-center">
            <LoginForm
                className="w-full max-w-sm"
                onSubmit={onSubmit}
                onGoogleLogin={handleGoogleLogin}
            />
        </div>
    );
}
