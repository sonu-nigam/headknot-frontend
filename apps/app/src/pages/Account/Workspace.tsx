import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Badge } from '@workspace/ui/components/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import { $api } from '@workspace/api-client';
import { CreateWorkspaceForm } from '@/forms/Account/CreateWorkspaceForm';
import { UpdateWorkspaceForm } from '@/forms/Account/UpdateWorkspaceForm';
import { useDeactivateWorkspace } from '@/hooks/workspace/useDeactivateWorkspace';
import { useAppStore } from '@/state/store';
import { components } from '@workspace/api-client';
import {
    Plus,
    AlertTriangle,
    Loader2,
    Shield,
    UserCircle,
    Trash2,
} from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';

export function Workspace() {
    const { data: workspaces, isLoading } = $api.useQuery("get", "/workspaces/my-workspaces");
    const { selectedWorkspaceId } = useAppStore();
    const activeWorkspace = workspaces?.find(
        (w) => w.id === selectedWorkspaceId,
    );

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Workspace Details */}
            {activeWorkspace && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    Workspace Details
                                </CardTitle>
                                <CardDescription>
                                    Manage your workspace settings and members.
                                </CardDescription>
                            </div>
                            <Badge
                                variant={
                                    activeWorkspace.active
                                        ? 'default'
                                        : 'secondary'
                                }
                                className={
                                    activeWorkspace.active
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : ''
                                }
                            >
                                {activeWorkspace.active
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Workspace Name</Label>
                            <p className="text-sm font-medium">
                                {activeWorkspace.name}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <p className="text-sm text-muted-foreground">
                                {activeWorkspace.description ||
                                    'No description provided.'}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Created</Label>
                            <p className="text-sm text-muted-foreground">
                                {activeWorkspace.createdAt
                                    ? format(
                                          new Date(activeWorkspace.createdAt),
                                          'MMM d, yyyy',
                                      )
                                    : '—'}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <UpdateWorkspaceDialog workspace={activeWorkspace} />
                    </CardFooter>
                </Card>
            )}

            {/* Members */}
            {activeWorkspace && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    Members
                                </CardTitle>
                                <CardDescription>
                                    People with access to this workspace.
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="size-3.5 mr-1.5" />
                                Add Member
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">
                                        Member
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">
                                        Role
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <UserCircle className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    You
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Owner
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            <Shield className="size-3 mr-1" />
                                            Owner
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-xs text-muted-foreground">
                                            Default
                                        </span>
                                    </TableCell>
                                </TableRow>
                                {activeWorkspace.members
                                    ?.filter(
                                        (m) =>
                                            m.value !==
                                            activeWorkspace.ownerId?.value,
                                    )
                                    .map((member) => (
                                        <TableRow key={member.value}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                                                        <UserCircle className="size-5 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-medium font-mono">
                                                        {member.value?.slice(
                                                            0,
                                                            8,
                                                        )}
                                                        ...
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    Member
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive h-7 text-xs"
                                                >
                                                    <Trash2 className="size-3 mr-1" />
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* All Workspaces */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">All Workspaces</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {workspaces?.map((workspace) => (
                        <div
                            key={workspace.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                        >
                            <div>
                                <p className="text-sm font-semibold">
                                    {workspace.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {workspace.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        workspace.active
                                            ? 'default'
                                            : 'secondary'
                                    }
                                    className={`text-[10px] ${workspace.active ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}`}
                                >
                                    {workspace.active ? 'Active' : 'Inactive'}
                                </Badge>
                                <UpdateWorkspaceDialog workspace={workspace} />
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <CreateWorkspaceForm />
                </CardFooter>
            </Card>

            {/* Danger Zone */}
            {activeWorkspace && activeWorkspace.active && (
                <Card className="border-destructive/30">
                    <CardHeader>
                        <CardTitle className="text-lg text-destructive flex items-center gap-2">
                            <AlertTriangle className="size-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Once you deactivate a workspace, all data will be
                            archived. This action can be reversed by an admin.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <DeactivateButton
                            workspaceId={activeWorkspace.id ?? ''}
                        />
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}

function UpdateWorkspaceDialog({
    workspace,
}: {
    workspace: components['schemas']['WorkspaceResponse'];
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Workspace</DialogTitle>
                    <DialogDescription>
                        Update your workspace details.
                    </DialogDescription>
                </DialogHeader>
                <UpdateWorkspaceForm workspace={workspace} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}

function DeactivateButton({ workspaceId }: { workspaceId: string }) {
    const deactivate = useDeactivateWorkspace();

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={() => deactivate.mutate({ params: { path: { id: workspaceId } } })}
            disabled={deactivate.isPending}
        >
            {deactivate.isPending
                ? 'Deactivating...'
                : 'Deactivate Workspace'}
        </Button>
    );
}
