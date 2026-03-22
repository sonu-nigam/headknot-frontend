import { useSearchParams } from 'react-router-dom';
import { SignupForm } from '@/forms/AuthForm/SignupForm';
import { SignupFormValues } from '@/validations/form/authForm';
import { initiateGoogleOAuth } from '@workspace/api-client';
import { useCallback } from 'react';
import { useSignup } from '@/hooks/auth/useSignup';

export default function Signup() {
    const [sp] = useSearchParams();
    const next = sp.get('next') || '/';
    const signup = useSignup();

    async function onSubmit(values: SignupFormValues) {
        signup.mutate(
            {
                fullName: values.fullName,
                username: values.username,
                password: values.password,
            },
            {
                onSuccess: () => {
                    window.location.href = next;
                },
            },
        );
    }

    const handleGoogleSignup = useCallback(async () => {
        try {
            const response = await initiateGoogleOAuth();

            if (!response?.authorizationUrl || !response?.state) {
                console.error('Invalid response from OAuth initiate endpoint');
                return;
            }

            sessionStorage.setItem('oauth_state', response.state);
            sessionStorage.setItem('oauth_next', next);

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
