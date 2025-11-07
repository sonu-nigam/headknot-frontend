
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().min(2).max(100),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  phoneNumber: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
});

export const profileResolver = zodResolver(profileSchema);

export type ProfileFormValues = z.infer<typeof profileSchema>;
