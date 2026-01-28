import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';

export const spaceSchema = z.object({
    name: z.string().min(2).max(100),
});

export const spaceResolver = zodResolver(spaceSchema);

export type SpaceFormValues = z.infer<typeof spaceSchema>;
