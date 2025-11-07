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
import { DialogFooter } from '@workspace/ui/components/dialog';

export function UpdateWorkspaceForm({
    workspace,
    setOpen,
}: {
    workspace: any;
    setOpen: (open: boolean) => void;
}) {
    const queryClient = useQueryClient();

    const { mutate: updateWorkspace, isPending } = useMutation({
        mutationFn: async (values: WorkspaceFormValues) => {
            const res = await api.PUT('/workspaces/{id}', {
                params: { path: { id: workspace.id } },
                body: values,
            });
            if (res.error) throw new Error('Failed to update workspace');
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-workspaces'] });
            setOpen(false);
        },
    });

    const form = useForm<WorkspaceFormValues>({
        resolver: workspaceResolver,
        defaultValues: {
            name: workspace.name,
            description: workspace.description,
        },
    });

    const onSubmit = (values: WorkspaceFormValues) => {
        updateWorkspace(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workspace Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
