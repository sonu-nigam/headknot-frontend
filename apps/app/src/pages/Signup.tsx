import { useSearchParams } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';
import { SignupForm } from '@/forms/AuthForm/SignupForm';
import { SignupFormValues } from '@/validations/form/authForm';
import { api, storage, initiateGoogleOAuth } from '@workspace/api-client';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function Signup() {
    const [sp] = useSearchParams();
    const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Signup' }];
    const next = sp.get('next') || '/';
    const signup = useMutation({
        mutationFn: async ({
            fullName,
            username,
            password,
        }: SignupFormValues) => {
            const { error, data } = await api.POST('/auth/signup', {
                body: { fullName, username, password },
            });
            if (error) throw error;
            return data;
        },
    });

    async function onSubmit(values: SignupFormValues) {
        signup.mutate(
            {
                fullName: values.fullName,
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

    const handleGoogleSignup = useCallback(async () => {
        try {
            // Call backend to initiate PKCE OAuth flow
            const response = await initiateGoogleOAuth();

            if (!response?.authorizationUrl || !response?.state) {
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
        <>
            <div className="min-h-screen grid place-items-center dark:bg-gray-950">
                <SignupForm
                    className="w-full max-w-sm"
                    onSubmit={onSubmit}
                    onGoogleLogin={handleGoogleSignup}
                />
            </div>
        </>
    );
}
