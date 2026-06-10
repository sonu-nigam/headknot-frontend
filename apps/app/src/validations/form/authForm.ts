import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';

export const loginSchema = z.object({
    username: z.string().email().min(2).max(100),
    password: z.string().min(6).max(100),
});

export const loginResolver = zodResolver(loginSchema);

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    fullName: z.string().min(2).max(100),
    username: z.string().email().min(2).max(100),
    password: z.string().min(6).max(100),
});

export const signupResolver = zodResolver(signupSchema);

export type SignupFormValues = z.infer<typeof signupSchema>;

export const verifyEmailSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export const verifyEmailResolver = zodResolver(verifyEmailSchema);

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email().min(2).max(100),
});

export const forgotPasswordResolver = zodResolver(forgotPasswordSchema);

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
    newPassword: z.string().min(6).max(100),
});

export const resetPasswordResolver = zodResolver(resetPasswordSchema);

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
