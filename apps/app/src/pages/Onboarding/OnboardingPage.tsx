import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import z from 'zod';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { useCreateWorkspace } from '@/hooks/workspace/useCreateWorkspace';

const workspaceSchema = z.object({
    name: z
        .string()
        .min(1, 'Workspace name is required')
        .max(100, 'Workspace name must be 100 characters or less'),
    description: z.string().max(500).optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

function DotGridPattern() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="dot-grid-onboarding"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(124,58,237,0.15)" />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#dot-grid-onboarding)"
            />
        </svg>
    );
}

export default function OnboardingPage() {
    const navigate = useNavigate();
    const createWorkspace = useCreateWorkspace();

    const form = useForm<WorkspaceFormValues>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    async function onSubmit(values: WorkspaceFormValues) {
        createWorkspace.mutate(
            {
                body: {
                    name: values.name,
                    description: values.description || undefined,
                },
            },
            {
                onSuccess: () => {
                    navigate('/');
                },
            },
        );
    }

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-hidden"
            style={{ backgroundColor: '#0d0d1c' }}
        >
            <DotGridPattern />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                        Headknot
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-sm text-gray-400">
                        Create Workspace
                    </span>
                </div>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-300"
                    title="Help"
                >
                    <HelpCircle className="h-5 w-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-lg">
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-8 rounded-full bg-purple-500" />
                                <div className="h-1.5 w-8 rounded-full bg-white/10" />
                            </div>
                            <span className="text-xs text-gray-400">
                                Step 1 of 2 &mdash; Workspace Setup
                            </span>
                        </div>
                    </div>

                    {/* Glass Panel Card */}
                    <div
                        className="rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl"
                        style={{ backgroundColor: 'rgba(30, 30, 46, 0.7)' }}
                    >
                        {/* Heading */}
                        <h1 className="mb-2 text-2xl font-bold text-white">
                            Create your first workspace
                        </h1>
                        <p className="mb-8 text-sm leading-relaxed text-gray-400">
                            Workspaces organize your knowledge into separate
                            environments for different projects or teams.
                        </p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Workspace Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm text-gray-300">
                                                Workspace Name{' '}
                                                <span className="text-red-400">
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. My Project"
                                                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm text-gray-300">
                                                Description{' '}
                                                <span className="text-gray-500">
                                                    (optional)
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="A workspace for project collaboration"
                                                    rows={3}
                                                    className="resize-none border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Create Button */}
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-purple-400"
                                    disabled={createWorkspace.isPending}
                                >
                                    {createWorkspace.isPending
                                        ? 'Creating...'
                                        : 'Create Workspace'}
                                    {!createWorkspace.isPending && (
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    )}
                                </Button>
                            </form>
                        </Form>

                        {/* Helper Text */}
                        <p className="mt-4 text-center text-xs text-gray-500">
                            You can create more workspaces later
                        </p>

                        {/* Error Display */}
                        {createWorkspace.isError && (
                            <p className="mt-3 text-center text-sm text-red-400">
                                Failed to create workspace. Please try again.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
