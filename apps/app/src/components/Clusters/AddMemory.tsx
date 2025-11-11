import {
    ChevronRight,
    Folder,
    Forward,
    MoreHorizontal,
    Plug,
    Plus,
    Trash2,
    type LucideIcon,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@workspace/ui/components/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { Link, useNavigate } from 'react-router-dom';
import { clusterQueryOptions } from '@/query/options/cluster';
import { useAppStore } from '@/state/store';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { memoryListQueryOptions } from '@/query/options/memory';
import { api } from '@workspace/api-client';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';

export function AddMemory({
    clusterId,
    workspaceId,
}: {
    clusterId: string;
    workspaceId: string;
}) {
    const navigate = useNavigate();
    const createMemory = useMutation({
        mutationFn: async () => {
            const { data, error } = await api.POST('/memory', {
                body: {
                    type: 'note',
                    clusterId,
                    workspaceId,
                },
            });

            if (error) {
                throw new Error('Failed to create memory');
            }

            return data;
        },
        onSuccess: (data) => {
            navigate(`/${convertMemoryIdToSlug(data.id)}`);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleCreateMemory = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        try {
            await createMemory.mutateAsync();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SidebarMenuAction
            showOnHover
            className="right-8"
            onClick={handleCreateMemory}
        >
            {createMemory.isPending ? <Spinner /> : <Plus />}
        </SidebarMenuAction>
    );
}
