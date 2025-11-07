
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';

export const workspaceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const workspaceResolver = zodResolver(workspaceSchema);

export type WorkspaceFormValues = z.infer<typeof workspaceSchema>;
