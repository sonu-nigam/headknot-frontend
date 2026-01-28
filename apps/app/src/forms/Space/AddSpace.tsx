import { useAppStore } from '@/state/store';
import { SpaceFormValues, spaceResolver } from '@/validations/form/spaceForm';
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

export function AddSpace({ children }: React.PropsWithChildren) {
    const { isVisible, createSpace, open, isCreating } =
        useCreateSpaceMutation();

    const onSubmit = (
        values: SpaceFormValues,
        setError: UseFormSetError<SpaceFormValues>,
    ) => {
        createSpace(values, {
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
                    <DialogTitle>Create Space</DialogTitle>
                    <DialogDescription>
                        Create a new space to share with others.
                    </DialogDescription>
                </DialogHeader>
                <AddSpaceForm onSubmit={onSubmit} isCreating={isCreating} />
            </DialogContent>
        </Dialog>
    );
}

function AddSpaceForm({
    onSubmit,
    isCreating,
}: {
    onSubmit: (
        values: SpaceFormValues,
        setError: UseFormSetError<SpaceFormValues>,
    ) => void;
    isCreating: boolean;
}) {
    const form = useForm<SpaceFormValues>({
        resolver: spaceResolver,
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
                            <FormLabel>Space Name</FormLabel>
                            <FormControl>
                                <Input placeholder="New Space" {...field} />
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
                        {isCreating ? 'Creating...' : 'Create Space'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

function useCreateSpaceMutation() {
    const [isVisible, setVisible] = useState(false);
    const queryClient = useQueryClient();
    const workspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { mutate: createSpace, isPending: isCreating } = useMutation({
        mutationFn: async (values: SpaceFormValues) => {
            const res = await api.POST('/spaces', {
                body: values,
                params: {
                    query: {
                        workspaceId,
                    },
                },
            });
            if (res.error) {
                return Promise.reject({
                    message: res.error.message || 'Failed to create space',
                    type: 'server',
                });
            }
            return res.data;
        },
        onSuccess: () => {
            setVisible(false);
            queryClient.invalidateQueries({
                queryKey: ['spaces', workspaceId],
            });
        },
    });

    return {
        isVisible,
        open: setVisible,
        createSpace,
        isCreating,
    };
}
