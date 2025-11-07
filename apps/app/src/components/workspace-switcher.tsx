import { BoxIcon, ChevronsUpDown, LockIcon, Plus, Check } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@workspace/ui/components/sidebar';
import { api } from '@workspace/api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { myWorkspacesQueryOptions } from '@/query/options/workspace';
import { useAppStore } from '@/state/store';
import { useEffect } from 'react';

export function WorkspaceSwitcher() {
    const { isMobile } = useSidebar();
    const { data: workspaces, isLoading: workspaceLoading } = useQuery(
        myWorkspacesQueryOptions,
    );

    // Persisted selection from zustand
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
    const setSelectedWorkspaceId = useAppStore((s) => s.setSelectedWorkspaceId);
    const selectedWorkspace = workspaces?.find(
        (w) => w.id === selectedWorkspaceId,
    );

    useEffect(() => {
        if (workspaces && !selectedWorkspaceId) {
            setSelectedWorkspaceId(workspaces[0].id);
        }
    }, [workspaces, setSelectedWorkspaceId]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <BoxIcon className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {selectedWorkspace?.name}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Workspaces
                        </DropdownMenuLabel>
                        {workspaces?.map((workspace, index) => (
                            <DropdownMenuItem
                                key={workspace.id}
                                onClick={() =>
                                    setSelectedWorkspaceId(workspace.id)
                                }
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <LockIcon className="size-3.5 shrink-0" />
                                </div>
                                <span className="truncate">
                                    {workspace.name}
                                </span>
                                {selectedWorkspaceId === workspace.id && (
                                    <Check className="ml-2 size-4 text-muted-foreground" />
                                )}
                                <DropdownMenuShortcut>
                                    ⌘{index + 1}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">
                                Add Workspace
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
