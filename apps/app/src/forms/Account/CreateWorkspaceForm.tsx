import { useForm } from 'react-hook-form';
import {
    workspaceResolver,
    WorkspaceFormValues,
} from '@/validations/form/workspaceForm';
import { useCreateWorkspace } from '@/hooks/workspace/useCreateWorkspace';
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
    const { mutate: createWorkspace, isPending: isCreating } = useCreateWorkspace();

    const form = useForm<WorkspaceFormValues>({
        resolver: workspaceResolver,
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = (values: WorkspaceFormValues) => {
        createWorkspace(
            { body: values },
            {
                onSuccess: () => {
                    form.reset();
                },
            },
        );
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
