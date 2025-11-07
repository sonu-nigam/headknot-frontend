import * as React from 'react';
import {
    Archive,
    Frame,
    LayoutDashboard,
    Map,
    PieChart,
    Plus,
    Search,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@workspace/ui/components/sidebar';
import { Button } from '@workspace/ui/components/button';
import { useAppStore } from '@/state/store';
import { useQuery } from '@tanstack/react-query';
import { memoryListByWorkspaceIdQueryOptions } from '@/query/options/memory';
import { myWorkspacesQueryOptions } from '@/query/options/workspace';

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/',
            icon: LayoutDashboard,
        },
        // {
        //     title: 'Inbox',
        //     url: '#',
        //     icon: Pin,
        // },
        // {
        //     title: 'Tasks',
        //     url: '#',
        //     icon: History,
        // },
        // {
        //     title: 'Files',
        //     url: '#',
        //     icon: Archive,
        // },
        // {
        //     title: 'Agents',
        //     url: '#',
        //     icon: Trash,
        // },
    ],
    projects: [
        {
            name: 'Unassigned',
            url: '#',
            icon: Frame,
            items: [],
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { displayCaptureMemoryForm } = useAppStore();

    const { data: activeWorkspace, isLoading: workspaceLoading } = useQuery({
        ...myWorkspacesQueryOptions,
        select: (data) => data?.find((workspace) => workspace.active),
    });

    const { data: memoryList, isLoading: memoryListLoading } = useQuery({
        ...memoryListByWorkspaceIdQueryOptions(activeWorkspace?.id as string),
        select: (data) =>
            data?.map((memory) => ({
                id: memory.id as string,
                title: memory.title as string,
                url: ('/' +
                    memory.title?.split(' ').join('_') +
                    '--' +
                    memory.id?.split('-').join('')) as string,
            })),
        enabled: !!activeWorkspace,
    });

    const projects = [
        {
            id: 'UNASSIGNED',
            title: 'Unassigned',
            url: '#',
            icon: Frame,
            items: memoryList,
            isActive: true,
        },
        {
            id: 'ARCHIVED',
            title: 'Archived',
            url: '#',
            icon: Archive,
            isActive: false,
        },
    ];
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <Button className="mx-4" onClick={displayCaptureMemoryForm}>
                    <Plus />
                    New Memory
                    <span className="ml-auto">⌘K</span>
                </Button>
                <Button className="mx-4" size="sm" variant="ghost">
                    <Search />
                    Search
                    <span className="ml-auto">⌘K</span>
                </Button>
                <NavMain items={data.navMain} />
                {memoryList && <NavProjects projects={projects} />}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
