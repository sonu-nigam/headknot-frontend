import {
    ActivityIcon,
    AlertTriangleIcon,
    ClockIcon,
    DatabaseIcon,
    GitBranchIcon,
    HomeIcon,
    NetworkIcon,
    PlugIcon,
    SearchIcon,
    SettingsIcon,
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
            icon: HomeIcon,
        },
        {
            title: 'Knowledge Graph',
            url: '/knowledge-graph',
            icon: NetworkIcon,
        },
        {
            title: 'Entities',
            url: '/entities',
            icon: DatabaseIcon,
        },
        {
            title: 'Relationships',
            url: '/relationships',
            icon: GitBranchIcon,
        },
        {
            title: 'Search',
            url: '/search',
            icon: SearchIcon,
        },
        {
            title: 'Timeline',
            url: '/timeline',
            icon: ClockIcon,
        },
        {
            title: 'Conflicts',
            url: '/conflicts',
            icon: AlertTriangleIcon,
        },
        {
            title: 'Activity',
            url: '/activity',
            icon: ActivityIcon,
        },
        {
            title: 'Integrations',
            url: '/integrations',
            icon: PlugIcon,
        },
        {
            title: 'Settings',
            url: '/account',
            icon: SettingsIcon,
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
