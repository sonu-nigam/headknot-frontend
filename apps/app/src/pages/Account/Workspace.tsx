import { components } from '@workspace/api-client';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { useQuery } from '@tanstack/react-query';
import { myWorkspacesQueryOptions } from '@/query/options/workspace';
import { CreateWorkspaceForm } from '@/forms/Account/CreateWorkspaceForm';
import { UpdateWorkspaceForm } from '@/forms/Account/UpdateWorkspaceForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@workspace/ui/components/dialog';
import React from 'react';
export function Workspace() {
    const { data: workspaces, isLoading } = useQuery(myWorkspacesQueryOptions);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Workspaces</CardTitle>
                <CardDescription>Manage your workspaces.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <ul>
                        {workspaces?.map((workspace) => (
                            <li
                                key={workspace.id}
                                className="flex items-center justify-between p-2 border-b"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {workspace.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {workspace.description}
                                    </p>
                                </div>
                                <UpdateWorkspaceDialog workspace={workspace} />
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter>
                <CreateWorkspaceForm />
            </CardFooter>
        </Card>
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
                <Button variant="outline">Edit</Button>
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
