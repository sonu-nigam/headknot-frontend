import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    VerifyEmailFormValues,
    verifyEmailResolver,
} from '@/validations/form/authForm';
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail';
import { useResendVerification } from '@/hooks/auth/useResendVerification';
import { OtpInput } from '@/components/OtpInput';
import { Button } from '@workspace/ui/components/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@workspace/ui/components/form';
import { MailCheck } from 'lucide-react';

const RESEND_COOLDOWN_SECONDS = 60;

function DotGridPattern() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dot-grid-verify"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(124,58,237,0.15)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid-verify)" />
        </svg>
    );
}

export default function VerifyEmail() {
    const [sp] = useSearchParams();
    const email = sp.get('email') || '';
    const next = sp.get('next') || '/';

    const verify = useVerifyEmail();
    const resend = useResendVerification();
    const [cooldown, setCooldown] = useState(0);

    const form = useForm<VerifyEmailFormValues>({
        resolver: verifyEmailResolver,
        defaultValues: { code: '' },
    });

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const onSubmit = useCallback(
        (values: VerifyEmailFormValues) => {
            verify.mutate(
                { body: { email, code: values.code } },
                {
                    onSuccess: () => {
                        window.location.href = next;
                    },
                    onError: (e: Error) => {
                        form.setValue('code', '');
                        toast.error(`Couldn't verify: ${e.message}`);
                    },
                },
            );
        },
        [email, next, verify, form],
    );

    const handleResend = useCallback(() => {
        if (cooldown > 0) return;
        resend.mutate({ body: { email } });
        setCooldown(RESEND_COOLDOWN_SECONDS);
    }, [cooldown, email, resend]);

    // Reached without an email (e.g. direct navigation) — nothing to verify.
    if (!email) {
        return <Navigate to="/signup" replace />;
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
                            <MailCheck className="h-6 w-6 text-purple-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Verify your email
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Enter the 6-digit code we sent to{' '}
                            <span className="font-medium text-gray-200">
                                {email}
                            </span>
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
                                                onComplete={() =>
                                                    form.handleSubmit(onSubmit)()
                                                }
                                                disabled={verify.isPending}
                                                autoFocus
                                            />
                                        </FormControl>
                                        <div className="text-center">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400"
                                disabled={verify.isPending}
                            >
                                {verify.isPending ? 'Verifying...' : 'Verify email'}
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
                        Wrong email?{' '}
                        <Link
                            to="/signup"
                            className="font-medium text-purple-400 hover:text-purple-300"
                        >
                            Sign up again
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
