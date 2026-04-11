import { Archive, Folder, Forward, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { SidebarMenuAction } from '@workspace/ui/components/sidebar';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { useNavigate } from 'react-router-dom';
import { invalidateByPath } from '@/lib/queryKeys';

export function MemoryMenu({
    isMobile,
    memoryId,
    clusterId,
}: {
    isMobile: boolean;
    memoryId: string;
    clusterId: string;
}) {
    const { viewMemory, shareMemory, trashMemory } = useMemoryMenuActions({
        clusterId,
        memoryId,
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
            >
                <DropdownMenuItem onSelect={viewMemory}>
                    <Folder className="text-muted-foreground" />
                    <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={trashMemory}>
                    <Archive className="text-muted-foreground" />
                    <span>Trash Memory</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function useMemoryMenuActions({
    clusterId,
    memoryId,
}: {
    clusterId: string;
    memoryId: string;
}) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: trashMemoryMutation } = $api.useMutation("patch", "/memory/{memoryId}/trash", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/memory");
        },
    });

    const viewMemory = () => {
        navigate(`/${memoryId}`);
    };

    const shareMemory = () => {
        // Implement share cluster action
    };

    const trashMemory = () => {
        trashMemoryMutation({
            params: { path: { memoryId } },
        });
    };

    return {
        viewMemory,
        shareMemory,
        trashMemory,
    };
}
