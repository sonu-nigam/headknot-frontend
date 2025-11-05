import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '@/forms/AuthForm/LoginForm';
import { LoginFormValues } from '@/validations/form/authForm';
import { useMutation } from '@tanstack/react-query';
import { api, storage, googleAuth } from '@workspace/api-client';
import { useCallback } from 'react';

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

    const googleLogin = useMutation({
        mutationFn: async (accessToken: string) => {
            return await googleAuth(accessToken);
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

    const handleGoogleLogin = useCallback(
        (accessToken: string) => {
            googleLogin.mutate(accessToken, {
                onSuccess: (data) => {
                    storage.access = data.accessToken;
                    storage.refresh = data.refreshToken;
                    window.location.href = next;
                },
                onError: (error) => {
                    console.error('Google login failed:', error);
                },
            });
        },
        [googleLogin, next],
    );

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
