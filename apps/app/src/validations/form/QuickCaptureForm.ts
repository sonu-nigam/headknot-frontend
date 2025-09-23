import { MEMORY_TYPES, VISIBILITY_TYPES } from '@/constants/common';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
// import { MemoryType, VisibilityType } from '@workspace/types';
import z from 'zod';

export const blockValidation = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('text'),
        data: z.object({ md: z.string().trim() }),
    }),
    z.object({
        kind: z.literal('code'),
        data: z.object({
            language: z.string().min(1),
            text: z.string().min(1),
        }),
    }),
    z.object({
        kind: z.literal('link-card'),
        data: z.object({
            url: z.string().url(),
            title: z.string().optional(),
            description: z.string().optional(),
            site: z.string().optional(),
        }),
    }),
    z.object({
        kind: z.literal('quote'),
        data: z.object({
            md: z.string().min(1),
            source_url: z.string().url().optional(),
        }),
    }),
    z.object({
        kind: z.literal('checklist'),
        data: z.object({
            items: z.array(
                z.object({
                    id: z.string(),
                    text: z.string(),
                    done: z.boolean(),
                }),
            ),
        }),
    }),
    z.object({
        kind: z.literal('image'),
        data: z.object({
            asset_id: z.string().min(1),
            alt: z.string().optional(),
            caption_md: z.string().optional(),
        }),
    }),
    z.object({
        kind: z.literal('file'),
        data: z.object({
            asset_id: z.string().min(1),
            name: z.string().min(1),
            mime: z.string().min(1),
        }),
    }),
    z.object({
        kind: z.literal('audio'),
        data: z.object({
            asset_id: z.string().min(1),
            duration_ms: z.number().optional(),
        }),
    }),
    z.object({ kind: z.literal('divider'), data: z.object({}) }),
]);

export type MemoryType = (typeof MEMORY_TYPES)[number];

export type VisibilityType = (typeof VISIBILITY_TYPES)[number];

export const quickCaptureFormSchema = z.object({
    title: z.string().trim().min(1),
    type: z.enum(MEMORY_TYPES),
    visibility: z.enum(VISIBILITY_TYPES),
    description: z.string().trim().min(1),
    // content: z.array(blockValidation),
});

export const quickCaptureFormResolver = zodResolver(quickCaptureFormSchema);

export type QuickCaptureFormValues = z.infer<typeof quickCaptureFormSchema>;
