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
import { NavClusters } from './Clusters/NavClusters';
import { api } from '@workspace/api-client';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const navigate = useNavigate();
    const { selectedWorkspaceId } = useAppStore();

    const createMemory = useMutation({
        mutationFn: async () => {
            const { data, error } = await api.POST('/memory', {
                body: {
                    type: 'note',
                    workspaceId: selectedWorkspaceId,
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

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <Button className="mx-4" onClick={() => createMemory.mutate()}>
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
                <NavClusters />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
