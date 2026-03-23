import {
    HourglassIcon,
    LayoutDashboardIcon,
    PanelTopIcon,
    PlugIcon,
} from 'lucide-react';
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
import { SidebarUser } from '../SidebarUser';
import { ComponentProps } from 'react';
import { CreateMemory } from './CreateMemory';
import { SearchTrigger } from './SearchTrigger';

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/',
            icon: LayoutDashboardIcon,
        },
        {
            title: 'Activity',
            url: '/activity',
            icon: HourglassIcon,
        },
        {
            title: 'Control Panel',
            url: '/control-panel',
            icon: PanelTopIcon,
        },
        {
            title: 'Integrations',
            url: '/integrations',
            icon: PlugIcon,
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
                <SearchTrigger />
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
