'use client';

import * as React from 'react';
import {
    Archive,
    AudioWaveform,
    BookOpen,
    Bot,
    BoxIcon,
    Command,
    Frame,
    GalleryVerticalEnd,
    History,
    LayoutDashboard,
    Map,
    PieChart,
    Pin,
    Plus,
    Search,
    Settings2,
    SquareTerminal,
    Trash,
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
import { QuickCaptureModal } from './QuickCaptureModal';
import { api } from '@workspace/api-client';
import { useQuery } from '@tanstack/react-query';

// This is sample data.
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    workspaces: [
        {
            name: 'Private',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Docusign',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Grappus',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Dashboard',
            url: '#',
            icon: LayoutDashboard,
        },
        {
            title: 'Inbox',
            url: '#',
            icon: Pin,
        },
        {
            title: 'Tasks',
            url: '#',
            icon: History,
        },
        {
            title: 'Files',
            url: '#',
            icon: Archive,
        },
        {
            title: 'Timeline',
            url: '#',
            icon: Trash,
        },
        {
            title: 'Automations',
            url: '#',
            icon: Trash,
        },
        {
            title: 'Agents',
            url: '#',
            icon: Trash,
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
            items: [
                {
                    title: 'Design Engineering',
                    url: '#',
                    icon: Frame,
                },
                {
                    title: 'Sales & Marketing',
                    url: '#',
                    icon: PieChart,
                },
                {
                    title: 'Travel',
                    url: '#',
                    icon: Map,
                },
            ],
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
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <QuickCaptureModal>
                    <Button className="mx-4">
                        <Plus />
                        New Memory
                        <span className="ml-auto">⌘K</span>
                    </Button>
                </QuickCaptureModal>
                <Button className="mx-4" size="sm" variant="ghost">
                    <Search />
                    Search
                    <span className="ml-auto">⌘K</span>
                </Button>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
