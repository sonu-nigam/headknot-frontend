import { HourglassIcon, LayoutDashboardIcon, TrashIcon } from 'lucide-react';
import { PlatformNav } from '@/components/PlatformNav';
import { WorkspaceSwitcher } from '@/components/sidebar/WorkspaceSwitcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@workspace/ui/components/sidebar';
import { useAppStore } from '@/state/store';
import { SpaceNav } from '../Clusters/SpaceNav';
import { SearchApp } from '../SearchApp';
import { SidebarUser } from '../SidebarUser';
import { ComponentProps } from 'react';
import { CreateMemory } from './CreateMemory';

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/',
            icon: LayoutDashboardIcon,
        },
        {
            title: 'Trash',
            url: '/trash',
            icon: TrashIcon,
        },
        {
            title: 'Activity',
            url: '/activity',
            icon: HourglassIcon,
        },
    ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
    const { selectedWorkspaceId } = useAppStore();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <CreateMemory workspaceId={selectedWorkspaceId as string} />
                <SearchApp />
                <PlatformNav items={data.navMain} />
                <SpaceNav />
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
