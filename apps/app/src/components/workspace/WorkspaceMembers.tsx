import { useState } from 'react';
import { useAddWorkspaceMember } from '@/hooks/workspace/useAddWorkspaceMember';
import { useRemoveWorkspaceMember } from '@/hooks/workspace/useRemoveWorkspaceMember';
import { Schemas } from '@/types/api';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { UserIcon, Trash2Icon, PlusIcon, CrownIcon } from 'lucide-react';

interface WorkspaceMembersProps {
    workspaceId: string;
    members: Schemas['UserId'][];
    ownerId?: string;
}

export function WorkspaceMembers({
    workspaceId,
    members,
    ownerId,
}: WorkspaceMembersProps) {
    const [newMemberId, setNewMemberId] = useState('');
    const addMember = useAddWorkspaceMember();
    const removeMember = useRemoveWorkspaceMember();

    const handleAddMember = () => {
        if (!newMemberId.trim()) return;
        addMember.mutate(
            { params: { path: { id: workspaceId } }, body: { memberId: newMemberId.trim() } },
            {
                onSuccess: () => setNewMemberId(''),
            },
        );
    };

    return (
        <div className="space-y-4">
            {/* Add member form */}
            <div className="flex gap-2">
                <Input
                    placeholder="User ID to add..."
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                />
                <Button
                    size="sm"
                    onClick={handleAddMember}
                    disabled={!newMemberId.trim() || addMember.isPending}
                >
                    <PlusIcon className="size-4" />
                    Add
                </Button>
            </div>

            {/* Members list */}
            <div className="space-y-1">
                {members.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No members yet
                    </p>
                ) : (
                    members.map((member) => {
                        const isOwner = member.value === ownerId;
                        return (
                            <div
                                key={member.value}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50"
                            >
                                <div className="p-1.5 rounded-md bg-muted">
                                    <UserIcon className="size-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-mono truncate">
                                        {member.value}
                                    </p>
                                    {isOwner && (
                                        <div className="flex items-center gap-1 text-xs text-primary">
                                            <CrownIcon className="size-3" />
                                            Owner
                                        </div>
                                    )}
                                </div>
                                {!isOwner && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                            removeMember.mutate({
                                                params: { path: { id: workspaceId, memberId: member.value! } },
                                            })
                                        }
                                        disabled={removeMember.isPending}
                                    >
                                        <Trash2Icon className="size-3.5" />
                                    </Button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
