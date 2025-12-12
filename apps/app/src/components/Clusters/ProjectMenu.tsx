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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@workspace/api-client';
import { useAppStore } from '@/state/store';

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
    const workspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { mutate: deleteCluster } = useMutation({
        mutationFn: async (clusterId: string) => {
            const res = await api.PATCH('/clusters/{clusterId}/trash', {
                params: {
                    path: {
                        clusterId,
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
            queryClient.invalidateQueries({
                queryKey: ['clusters', workspaceId],
            });
        },
    });

    const viewCluster = () => {
        // Implement view cluster action
        navigate(`/clusters/${clusterId}`);
    };

    const shareCluster = () => {
        // Implement share cluster action
    };

    const trashCluster = () => {
        deleteCluster(clusterId);
    };

    return {
        viewCluster,
        shareCluster,
        trashCluster,
    };
}
