import AppLayout from '@/components/AppLayout';
import { myWorkspacesQueryOptions } from '@/query/options/workspace';
import { useAppStore } from '@/state/store';
import {
    WorkspaceFormValues,
    workspaceResolver,
} from '@/validations/form/workspaceForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Textarea } from '@workspace/ui/components/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

import {
    BoxIcon,
    MoreVertical,
    Plus,
    Edit,
    Trash2,
    Users,
    Calendar,
    Power,
    PowerOff,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { useCreateWorkspace } from '@/hooks/workspace/useCreateWorkspace';
import { useUpdateWorkspace } from '@/hooks/workspace/useUpdateWorkspace';
import { useDeleteWorkspace } from '@/hooks/workspace/useDeleteWorkspace';
import { useActivateWorkspace } from '@/hooks/workspace/useActivateWorkspace';
import { useDeactivateWorkspace } from '@/hooks/workspace/useDeactivateWorkspace';
import { WorkspaceMembers } from '@/components/workspace/WorkspaceMembers';

export default function Workspace() {
    const { data: workspaces, isLoading } = useQuery(myWorkspacesQueryOptions);
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    return (
        <AppLayout
            breadcrumbs={[
                { label: 'Workspace', href: '/' },
                { label: 'Settings' },
            ]}
        >
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Workspaces
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your workspaces and collaborate with your
                            team
                        </p>
                    </div>
                    <CreateWorkspaceDialog>
                        <Button className="gap-2">
                            <Plus className="size-4" />
                            Create Workspace
                        </Button>
                    </CreateWorkspaceDialog>
                </div>

                {/* Workspaces List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-muted/50 h-48 rounded-lg animate-pulse"
                                />
                            ))}
                        </>
                    ) : workspaces && workspaces.length > 0 ? (
                        workspaces.map((workspace) => (
                            <WorkspaceCard
                                key={workspace.id}
                                workspace={workspace}
                                isActive={selectedWorkspaceId === workspace.id}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <BoxIcon className="size-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-1">
                                No workspaces yet
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by creating your first workspace
                            </p>
                            <CreateWorkspaceDialog>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="size-4" />
                                    Create Workspace
                                </Button>
                            </CreateWorkspaceDialog>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

interface WorkspaceCardProps {
    workspace: any;
    isActive: boolean;
}

function WorkspaceCard({ workspace, isActive }: WorkspaceCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showMembersDialog, setShowMembersDialog] = useState(false);
    const setSelectedWorkspaceId = useAppStore((s) => s.setSelectedWorkspaceId);
    const activateWorkspace = useActivateWorkspace();
    const deactivateWorkspace = useDeactivateWorkspace();

    const isWorkspaceActive = workspace.active !== false;

    return (
        <>
            <div
                className={`bg-card border rounded-lg p-6 transition-all hover:shadow-md ${
                    isActive ? 'ring-2 ring-primary' : ''
                } ${!isWorkspaceActive ? 'opacity-60' : ''}`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                        <BoxIcon className="size-6 text-primary" />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setShowEditDialog(true)}
                                className="gap-2"
                            >
                                <Edit className="size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setShowMembersDialog(true)}
                                className="gap-2"
                            >
                                <Users className="size-4" />
                                Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isWorkspaceActive ? (
                                <DropdownMenuItem
                                    onClick={() =>
                                        deactivateWorkspace.mutate(workspace.id)
                                    }
                                    className="gap-2"
                                >
                                    <PowerOff className="size-4" />
                                    Deactivate
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={() =>
                                        activateWorkspace.mutate(workspace.id)
                                    }
                                    className="gap-2"
                                >
                                    <Power className="size-4" />
                                    Activate
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => setShowDeleteDialog(true)}
                                className="gap-2 text-destructive focus:text-destructive"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                            {workspace.name}
                            {isActive && (
                                <span className="text-primary text-xs px-2 py-0.5 bg-primary/10 rounded-full">
                                    Active
                                </span>
                            )}
                            {!isWorkspaceActive && (
                                <span className="text-muted-foreground text-xs px-2 py-0.5 bg-muted rounded-full">
                                    Inactive
                                </span>
                            )}
                        </h3>
                        {workspace.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2">
                                {workspace.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            <span>
                                {workspace.members?.length || 1} member
                                {(workspace.members?.length || 1) !== 1
                                    ? 's'
                                    : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            <span>
                                {workspace.createdAt
                                    ? new Date(
                                          workspace.createdAt,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {!isActive && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() =>
                                setSelectedWorkspaceId(workspace.id as string)
                            }
                        >
                            Switch to this workspace
                        </Button>
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <EditWorkspaceDialog
                workspace={workspace}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteWorkspaceDialog
                workspace={workspace}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />

            {/* Members Dialog */}
            <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Workspace Members</DialogTitle>
                        <DialogDescription>
                            Manage members of "{workspace.name}"
                        </DialogDescription>
                    </DialogHeader>
                    <WorkspaceMembers
                        workspaceId={workspace.id}
                        members={workspace.members || []}
                        ownerId={workspace.ownerId?.value}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

interface CreateWorkspaceDialogProps {
    children: React.ReactNode;
}

function CreateWorkspaceDialog({ children }: CreateWorkspaceDialogProps) {
    const [open, setOpen] = useState(false);
    const createWorkspace = useCreateWorkspace();

    const onSubmit = (
        values: WorkspaceFormValues,
        setError: UseFormSetError<WorkspaceFormValues>,
    ) => {
        createWorkspace.mutate(values, {
            onSuccess: () => setOpen(false),
            onError: (error: any) => {
                setError('name', { message: error.message });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your projects and
                        collaborate with your team.
                    </DialogDescription>
                </DialogHeader>
                <WorkspaceForm
                    onSubmit={onSubmit}
                    isSubmitting={createWorkspace.isPending}
                    submitLabel="Create Workspace"
                />
            </DialogContent>
        </Dialog>
    );
}

interface EditWorkspaceDialogProps {
    workspace: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function EditWorkspaceDialog({
    workspace,
    open,
    onOpenChange,
}: EditWorkspaceDialogProps) {
    const updateWorkspace = useUpdateWorkspace();

    const onSubmit = (
        values: WorkspaceFormValues,
        setError: UseFormSetError<WorkspaceFormValues>,
    ) => {
        updateWorkspace.mutate(
            { id: workspace.id, body: values },
            {
                onSuccess: () => onOpenChange(false),
                onError: (error: any) => {
                    setError('name', { message: error.message });
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Workspace</DialogTitle>
                    <DialogDescription>
                        Update your workspace information.
                    </DialogDescription>
                </DialogHeader>
                <WorkspaceForm
                    onSubmit={onSubmit}
                    isSubmitting={updateWorkspace.isPending}
                    submitLabel="Save Changes"
                    defaultValues={{
                        name: workspace.name,
                        description: workspace.description || '',
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

interface DeleteWorkspaceDialogProps {
    workspace: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function DeleteWorkspaceDialog({
    workspace,
    open,
    onOpenChange,
}: DeleteWorkspaceDialogProps) {
    const queryClient = useQueryClient();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const setSelectedWorkspaceId = useAppStore((s) => s.setSelectedWorkspaceId);
    const deleteWorkspace = useDeleteWorkspace();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Workspace</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{workspace.name}"? This
                        action cannot be undone and will permanently remove all
                        data associated with this workspace.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={deleteWorkspace.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() =>
                            deleteWorkspace.mutate(workspace.id, {
                                onSuccess: () => {
                                    onOpenChange(false);
                                    if (
                                        selectedWorkspaceId === workspace.id
                                    ) {
                                        const workspaces =
                                            queryClient.getQueryData<any[]>([
                                                'my-workspaces',
                                            ]);
                                        const nextWorkspace = workspaces?.find(
                                            (w) => w.id !== workspace.id,
                                        );
                                        if (nextWorkspace) {
                                            setSelectedWorkspaceId(
                                                nextWorkspace.id,
                                            );
                                        }
                                    }
                                },
                            })
                        }
                        disabled={deleteWorkspace.isPending}
                    >
                        {deleteWorkspace.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface WorkspaceFormProps {
    onSubmit: (
        values: WorkspaceFormValues,
        setError: UseFormSetError<WorkspaceFormValues>,
    ) => void;
    isSubmitting: boolean;
    submitLabel: string;
    defaultValues?: Partial<WorkspaceFormValues>;
}

function WorkspaceForm({
    onSubmit,
    isSubmitting,
    submitLabel,
    defaultValues,
}: WorkspaceFormProps) {
    const form = useForm<WorkspaceFormValues>({
        resolver: workspaceResolver,
        defaultValues: defaultValues || {
            name: '',
            description: '',
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) =>
                    onSubmit(values, form.setError),
                )}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workspace Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="My Workspace" {...field} />
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
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="A brief description of this workspace..."
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? 'Saving...' : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
