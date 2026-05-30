import React from 'react';
import { format } from 'date-fns';
import { Plus, Shield, Trash2, UserCircle } from 'lucide-react';
import { $api, components } from '@workspace/api-client';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Label } from '@workspace/ui/components/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';
import { CreateWorkspaceForm } from '@/forms/Account/CreateWorkspaceForm';
import { UpdateWorkspaceForm } from '@/forms/Account/UpdateWorkspaceForm';
import { useDeactivateWorkspace } from '@/hooks/workspace/useDeactivateWorkspace';
import { useAppStore } from '@/state/store';
import { SettingsSection } from '../components/SettingsSection';
import { SectionError, SectionSkeleton } from '../components/SectionStates';

function ActiveBadge({ active }: { active?: boolean }) {
    return (
        <Badge
            variant={active ? 'default' : 'secondary'}
            className={cn(
                'text-xs',
                active &&
                    'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            )}
        >
            {active ? 'Active' : 'Inactive'}
        </Badge>
    );
}

export function WorkspaceSection() {
    const {
        data: workspaces,
        isLoading,
        isError,
        refetch,
    } = $api.useQuery('get', '/workspaces/my-workspaces');
    const { selectedWorkspaceId } = useAppStore();
    const activeWorkspace = workspaces?.find(
        (w: components['schemas']['WorkspaceResponse']) =>
            w.id === selectedWorkspaceId,
    );

    if (isLoading) return <SectionSkeleton rows={4} />;
    if (isError) {
        return (
            <SectionError
                message="Couldn't load your workspaces."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <>
            {activeWorkspace && (
                <SettingsSection
                    title="Workspace Details"
                    description="Manage your workspace settings and members."
                    footer={<UpdateWorkspaceDialog workspace={activeWorkspace} />}
                >
                    <div className="mb-4 flex justify-end">
                        <ActiveBadge active={activeWorkspace.active} />
                    </div>
                    <div className="space-y-4">
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
                    </div>
                </SettingsSection>
            )}

            {activeWorkspace && (
                <SettingsSection
                    title="Members"
                    description="People with access to this workspace."
                >
                    <div className="mb-3 flex justify-end">
                        <Button variant="outline" size="sm">
                            <Plus className="mr-1.5 size-3.5" />
                            Add Member
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
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
                                    <Badge variant="outline" className="text-xs">
                                        <Shield className="mr-1 size-3" />
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
                                    (m: components['schemas']['UserId']) =>
                                        m.value !==
                                        activeWorkspace.ownerId?.value,
                                )
                                .map((member: components['schemas']['UserId']) => (
                                    <TableRow key={member.value}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                                                    <UserCircle className="size-5 text-muted-foreground" />
                                                </div>
                                                <p className="font-mono text-sm font-medium">
                                                    {member.value?.slice(0, 8)}…
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
                                                className="h-7 text-xs text-destructive"
                                            >
                                                <Trash2 className="mr-1 size-3" />
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </SettingsSection>
            )}

            <SettingsSection
                title="All Workspaces"
                footer={<CreateWorkspaceForm />}
            >
                <div className="space-y-3">
                    {workspaces?.map((workspace: components['schemas']['WorkspaceResponse']) => (
                        <div
                            key={workspace.id}
                            className="flex items-center justify-between rounded-lg border p-3"
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
                                <ActiveBadge active={workspace.active} />
                                <UpdateWorkspaceDialog workspace={workspace} />
                            </div>
                        </div>
                    ))}
                </div>
            </SettingsSection>

            {activeWorkspace && activeWorkspace.active && (
                <SettingsSection
                    title="Danger Zone"
                    description="Once you deactivate a workspace, all data will be archived. This action can be reversed by an admin."
                    tone="destructive"
                    footer={
                        <DeactivateButton
                            workspaceId={activeWorkspace.id ?? ''}
                        />
                    }
                />
            )}
        </>
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
            onClick={() =>
                deactivate.mutate({ params: { path: { id: workspaceId } } })
            }
            disabled={deactivate.isPending}
        >
            {deactivate.isPending ? 'Deactivating...' : 'Deactivate Workspace'}
        </Button>
    );
}
