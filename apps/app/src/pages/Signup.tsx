import { useSearchParams, Link } from 'react-router-dom';
import {
    SignupFormValues,
    signupResolver,
} from '@/validations/form/authForm';
import { initiateGoogleOAuth } from '@workspace/api-client';
import { useCallback, useState } from 'react';
import { useSignup } from '@/hooks/auth/useSignup';
import { useForm } from 'react-hook-form';
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
import { User, Lock, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';

function DotGridPattern() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dot-grid-signup"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(124,58,237,0.15)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid-signup)" />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-5 w-5"
        >
            <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
            />
        </svg>
    );
}

export default function Signup() {
    const [sp] = useSearchParams();
    const next = sp.get('next') || '/';
    const signup = useSignup();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<SignupFormValues>({
        resolver: signupResolver,
        defaultValues: {
            fullName: '',
            username: '',
            password: '',
        },
    });

    const usernameValue = form.watch('username');
    const isUsernameValid =
        usernameValue.length > 4 && usernameValue.includes('@');

    async function onSubmit(values: SignupFormValues) {
        signup.mutate(
            {
                body: {
                    fullName: values.fullName,
                    username: values.username,
                    password: values.password,
                },
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
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#0d0d1c' }}
        >
            <DotGridPattern />

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Glass Panel Card */}
                <div
                    className="rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl"
                    style={{ backgroundColor: 'rgba(30, 30, 46, 0.7)' }}
                >
                    {/* Branding */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white">
                            Headknot
                        </h1>
                        <p className="mt-1 text-xs font-medium tracking-widest text-purple-400 uppercase">
                            Knowledge Evolution Tracking
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            {/* Full Name Field */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <UserPlus className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                <Input
                                                    placeholder="John Doe"
                                                    autoComplete="name"
                                                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Username Field with availability check */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                <Input
                                                    placeholder="you@example.com"
                                                    autoComplete="username"
                                                    className="border-white/10 bg-white/5 pr-10 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                                {isUsernameValid && (
                                                    <CheckCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-green-400" />
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-gray-300">
                                            Password
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

                            {/* Confirm Password Field (visual only, not in schema) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input
                                        placeholder="********"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        autoComplete="new-password"
                                        className="border-white/10 bg-white/5 pr-10 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Create Account Button */}
                            <Button
                                type="submit"
                                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400"
                                disabled={signup.isPending}
                            >
                                {signup.isPending
                                    ? 'Creating account...'
                                    : 'Create Account'}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span
                                        className="px-3 text-gray-500"
                                        style={{
                                            backgroundColor:
                                                'rgba(30, 30, 46, 0.7)',
                                        }}
                                    >
                                        or
                                    </span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full cursor-pointer border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                                onClick={handleGoogleSignup}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </Button>
                        </form>
                    </Form>

                    {/* Sign In Link */}
                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-purple-400 hover:text-purple-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <a href="#" className="hover:text-gray-300">
                        Privacy Policy
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:text-gray-300">
                        Terms of Service
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:text-gray-300">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
