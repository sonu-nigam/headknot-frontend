import { Folder, Forward, MoreHorizontal, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { SidebarMenuAction } from '@workspace/ui/components/sidebar';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';
import { invalidateByPath } from '@/lib/queryKeys';

export function ProjectMenu({
    isMobile,
    clusterId,
}: {
    isMobile: boolean;
    clusterId: string;
}) {
    const { viewCluster, shareCluster, trashCluster } = useClusterMenuActions({
        clusterId,
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
                <DropdownMenuItem onSelect={viewCluster}>
                    <Folder className="text-muted-foreground" />
                    <span>View Cluster</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={shareCluster}>
                    <Forward className="text-muted-foreground" />
                    <span>Share Cluster</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={trashCluster}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Trash Cluster</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function useClusterMenuActions({ clusterId }: { clusterId: string }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: deleteCluster } = $api.useMutation("patch", "/clusters/{clusterId}/trash", {
        onSuccess: () => {
            invalidateByPath(queryClient, "get", "/clusters");
        },
    });

    const viewCluster = () => {
        navigate(`/clusters/${clusterId}`);
    };

    const shareCluster = () => {
        // Implement share cluster action
    };

    const trashCluster = () => {
        deleteCluster({
            params: { path: { clusterId } },
        });
    };

    return {
        viewCluster,
        shareCluster,
        trashCluster,
    };
}
