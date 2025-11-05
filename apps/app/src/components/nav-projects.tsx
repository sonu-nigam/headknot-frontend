'use client';

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
import { Link } from 'react-router-dom';

export function NavProjects({
    projects,
}: {
    projects: {
        id: string;
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            id: string;
            title: string;
            url: string;
            icon: LucideIcon;
        }[];
    }[];
}) {
    const { isMobile } = useSidebar();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex justify-between">
                Collections
                <Button size="icon" variant="secondary" className="size-6">
                    <Plus />
                </Button>
            </SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => {
                    const Icon = item.icon;
                    if (!item.items)
                        return (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton asChild>
                                    <Link to={item.url}>
                                        {!!Icon && <Icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );

                    return (
                        <Collapsible
                            key={item.id}
                            asChild
                            className="group/collapsible"
                            defaultOpen={item.isActive}
                        >
                            <SidebarMenuItem key={item.id}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={item.url}
                                            className="group/item"
                                        >
                                            <ChevronRight className="hidden group-hover/item:block transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            {!!Icon && (
                                                <Icon className="block group-hover/item:hidden" />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem
                                                key={subItem.title}
                                            >
                                                <SidebarMenuSubButton asChild>
                                                    <Link to={subItem.url}>
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuAction showOnHover>
                                                <MoreHorizontal />
                                                <span className="sr-only">
                                                    More
                                                </span>
                                            </SidebarMenuAction>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-48 rounded-lg"
                                            side={isMobile ? 'bottom' : 'right'}
                                            align={isMobile ? 'end' : 'start'}
                                        >
                                            <DropdownMenuItem>
                                                <Folder className="text-muted-foreground" />
                                                <span>View Project</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Forward className="text-muted-foreground" />
                                                <span>Share Project</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Trash2 className="text-muted-foreground" />
                                                <span>Delete Project</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
