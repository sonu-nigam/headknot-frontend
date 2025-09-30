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
