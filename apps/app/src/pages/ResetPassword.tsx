import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    ResetPasswordFormValues,
    resetPasswordResolver,
} from '@/validations/form/authForm';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
import { OtpInput } from '@/components/OtpInput';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { KeyRound, Lock, Eye, EyeOff } from 'lucide-react';

const RESEND_COOLDOWN_SECONDS = 60;

function DotGridPattern() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dot-grid-reset"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(124,58,237,0.15)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid-reset)" />
        </svg>
    );
}

export default function ResetPassword() {
    const [sp] = useSearchParams();
    const email = sp.get('email') || '';
    const next = sp.get('next') || '/';
    const navigate = useNavigate();

    const reset = useResetPassword();
    const resend = useForgotPassword();
    const [cooldown, setCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<ResetPasswordFormValues>({
        resolver: resetPasswordResolver,
        defaultValues: { code: '', newPassword: '' },
    });

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const onSubmit = useCallback(
        (values: ResetPasswordFormValues) => {
            reset.mutate(
                {
                    body: {
                        email,
                        code: values.code,
                        newPassword: values.newPassword,
                    },
                },
                {
                    onSuccess: () => {
                        // The backend revokes all sessions on reset, so send the
                        // user to login to sign in with the new password.
                        toast.success(
                            'Password reset. Please log in with your new password.',
                        );
                        navigate(
                            `/login?next=${encodeURIComponent(next)}`,
                            { replace: true },
                        );
                    },
                    onError: (e: Error) => {
                        form.setValue('code', '');
                        toast.error(`Couldn't reset password: ${e.message}`);
                    },
                },
            );
        },
        [email, next, reset, form, navigate],
    );

    const handleResend = useCallback(() => {
        if (cooldown > 0) return;
        resend.mutate(
            { body: { email } },
            {
                onSuccess: () =>
                    toast.success('Reset code sent. Check your inbox.'),
                onError: (e: Error) =>
                    toast.error(`Couldn't resend the code: ${e.message}`),
            },
        );
        setCooldown(RESEND_COOLDOWN_SECONDS);
    }, [cooldown, email, resend]);

    // Reached without an email (e.g. direct navigation) — start from the request step.
    if (!email) {
        return <Navigate to="/forgot-password" replace />;
    }

    return (
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#0d0d1c' }}
        >
            <DotGridPattern />

            <div className="relative z-10 w-full max-w-md px-4">
                <div
                    className="rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl"
                    style={{ backgroundColor: 'rgba(30, 30, 46, 0.7)' }}
                >
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/15">
                            <KeyRound className="h-6 w-6 text-purple-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Reset your password
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Enter the 6-digit code we sent to{' '}
                            <span className="font-medium text-gray-200">
                                {email}
                            </span>{' '}
                            and choose a new password.
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <OtpInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={reset.isPending}
                                                autoFocus
                                            />
                                        </FormControl>
                                        <div className="text-center">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">
                                            New password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                <Input
                                                    placeholder="********"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    autoComplete="new-password"
                                                    className="border-white/10 bg-white/5 pr-10 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword,
                                                        )
                                                    }
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400"
                                disabled={reset.isPending}
                            >
                                {reset.isPending
                                    ? 'Resetting...'
                                    : 'Reset password'}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Didn&apos;t get a code?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={cooldown > 0 || resend.isPending}
                            className="font-medium text-purple-400 hover:text-purple-300 disabled:cursor-not-allowed disabled:text-gray-500"
                        >
                            {cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : 'Resend code'}
                        </button>
                    </div>

                    <p className="mt-2 text-center text-sm text-gray-400">
                        Back to{' '}
                        <Link
                            to="/login"
                            className="font-medium text-purple-400 hover:text-purple-300"
                        >
                            login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
