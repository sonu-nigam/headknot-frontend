import { useForm } from 'react-hook-form';
import {
    workspaceResolver,
    WorkspaceFormValues,
} from '@/validations/form/workspaceForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Button } from '@workspace/ui/components/button';

export function CreateWorkspaceForm() {
    const queryClient = useQueryClient();

    const { mutate: createWorkspace, isPending: isCreating } = useMutation({
        mutationFn: async (values: WorkspaceFormValues) => {
            const res = await api.POST('/workspaces', { body: values });
            if (res.error) throw new Error('Failed to create workspace');
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
        },
    });

    const form = useForm<WorkspaceFormValues>({
        resolver: workspaceResolver,
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = (values: WorkspaceFormValues) => {
        createWorkspace(values);
        form.reset();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Workspace Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter workspace name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter workspace description"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Workspace'}
                </Button>
            </form>
        </Form>
    );
}
