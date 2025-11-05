import { useSearchParams } from 'react-router-dom';
import { SignupForm } from '@/forms/AuthForm/SignupForm';
import { SignupFormValues } from '@/validations/form/authForm';
import { api, storage, googleAuth } from '@workspace/api-client';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function Signup() {
    const [sp] = useSearchParams();
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

    const googleSignup = useMutation({
        mutationFn: async (accessToken: string) => {
            return await googleAuth(accessToken);
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

    const handleGoogleSignup = useCallback(
        (accessToken: string) => {
            googleSignup.mutate(accessToken, {
                onSuccess: (data) => {
                    storage.access = data.accessToken;
                    storage.refresh = data.refreshToken;
                    window.location.href = next;
                },
                onError: (error) => {
                    console.error('Google signup failed:', error);
                },
            });
        },
        [googleSignup, next],
    );

    return (
        <div className="min-h-screen grid place-items-center">
            <SignupForm
                className="w-full max-w-sm"
                onSubmit={onSubmit}
                onGoogleLogin={handleGoogleSignup}
            />
        </div>
    );
}
