import { useAppStore } from '@/state/store';
import {
    ClusterFormValues,
    clusterResolver,
} from '@/validations/form/clusterForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { useState } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';

export function AddCluster({ children }: React.PropsWithChildren) {
    const { isVisible, createCluster, open, isCreating } =
        useCreateClusterMutation();

    const onSubmit = (
        values: ClusterFormValues,
        setError: UseFormSetError<ClusterFormValues>,
    ) => {
        createCluster(values, {
            onError: (error: any) => {
                setError('name', { message: error.message });
            },
        });
    };

    return (
        <Dialog open={isVisible} onOpenChange={open}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Cluster</DialogTitle>
                    <DialogDescription>
                        Create a new cluster to share with others.
                    </DialogDescription>
                </DialogHeader>
                <AddClusterForm onSubmit={onSubmit} isCreating={isCreating} />
            </DialogContent>
        </Dialog>
    );
}

function AddClusterForm({
    onSubmit,
    isCreating,
}: {
    onSubmit: (
        values: ClusterFormValues,
        setError: UseFormSetError<ClusterFormValues>,
    ) => void;
    isCreating: boolean;
}) {
    const form = useForm<ClusterFormValues>({
        resolver: clusterResolver,
        defaultValues: {
            name: '',
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) =>
                    onSubmit(values, form.setError),
                )}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cluster Name</FormLabel>
                            <FormControl>
                                <Input placeholder="New Cluster" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="sm:justify-start mt-4">
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : 'Create Cluster'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

function useCreateClusterMutation() {
    const [isVisible, setVisible] = useState(false);
    const queryClient = useQueryClient();
    const workspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { mutate: createCluster, isPending: isCreating } = useMutation({
        mutationFn: async (values: ClusterFormValues) => {
            const res = await api.POST('/clusters', {
                body: values,
                params: {
                    query: {
                        workspaceId,
                    },
                },
            });
            if (res.error) {
                return Promise.reject({
                    message: res.error.message || 'Failed to create cluster',
                    type: 'server',
                });
            }
            return res.data;
        },
        onSuccess: () => {
            setVisible(false);
            queryClient.invalidateQueries({
                queryKey: ['clusters', workspaceId],
            });
        },
    });

    return {
        isVisible,
        open: setVisible,
        createCluster,
        isCreating,
    };
}
