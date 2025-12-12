import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';

export const clusterSchema = z.object({
    name: z.string().min(2).max(100),
});

export const clusterResolver = zodResolver(clusterSchema);

export type ClusterFormValues = z.infer<typeof clusterSchema>;
