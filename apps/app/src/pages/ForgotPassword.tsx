import { useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    ForgotPasswordFormValues,
    forgotPasswordResolver,
} from '@/validations/form/authForm';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
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
import { KeyRound, Mail } from 'lucide-react';

function DotGridPattern() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dot-grid-forgot"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(124,58,237,0.15)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid-forgot)" />
        </svg>
    );
}

export default function ForgotPassword() {
    const [sp] = useSearchParams();
    const next = sp.get('next') || '/';
    const navigate = useNavigate();
    const forgot = useForgotPassword();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: forgotPasswordResolver,
        defaultValues: { email: '' },
    });

    const onSubmit = useCallback(
        (values: ForgotPasswordFormValues) => {
            forgot.mutate(
                { body: { email: values.email } },
                {
                    onSuccess: () => {
                        // Always 202 — proceed to the reset step regardless of
                        // whether the account exists (no account enumeration).
                        toast.success(
                            "If an account exists, we've sent a reset code.",
                        );
                        navigate(
                            `/reset-password?email=${encodeURIComponent(
                                values.email,
                            )}&next=${encodeURIComponent(next)}`,
                        );
                    },
                    onError: (e: Error) => {
                        toast.error(`Couldn't send a reset code: ${e.message}`);
                    },
                },
            );
        },
        [forgot, navigate, next],
    );

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
                            Forgot your password?
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Enter your email and we&apos;ll send you a 6-digit
                            code to reset it.
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                <Input
                                                    placeholder="you@example.com"
                                                    autoComplete="username"
                                                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400"
                                disabled={forgot.isPending}
                            >
                                {forgot.isPending
                                    ? 'Sending...'
                                    : 'Send reset code'}
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Remembered it?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-purple-400 hover:text-purple-300"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
