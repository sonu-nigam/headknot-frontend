import { ChevronRight, Folder, Plus, type LucideIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    useSidebar,
} from '@workspace/ui/components/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { Button } from '@workspace/ui/components/button';
import { Link } from 'react-router-dom';
import { spaceQueryOptions } from '@/query/options/space';
import { useAppStore } from '@/state/store';
import { useQuery } from '@tanstack/react-query';
import { AddMemory } from './AddMemory';
import { ProjectMenu } from './ProjectMenu';
import { MemoryList } from './MemoryList';
import { AddSpace } from '@/forms/Space/AddSpace';

export function SpaceNav() {
    const { isMobile } = useSidebar();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: workspaceSpaces } = useQuery({
        ...spaceQueryOptions({
            workspaceId: selectedWorkspaceId as string,
            status: 'ACTIVE',
        }),
        enabled: !!selectedWorkspaceId,
    });

    const spaces = workspaceSpaces?.map((space) => ({
        id: space.id as string,
        title: space.name as string,
        url: `/space/${space.id}` as string,
        icon: Folder as LucideIcon,
        isActive: false as boolean,
    }));

    const organizedspaces = spaces?.reduce(
        (acc, space) => {
            const isArchived = space.title.toLowerCase().startsWith('archived');
            const isUnassigned = space.title
                .toLowerCase()
                .startsWith('unassigned');

            if (isArchived) return acc;

            if (isUnassigned) {
                return [space, ...acc];
            } else {
                return [...acc, space];
            }
        },
        [] as typeof spaces,
    );

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex justify-between">
                Spaces
                <AddSpace>
                    <Button size="icon" variant="secondary" className="size-6">
                        <Plus />
                    </Button>
                </AddSpace>
            </SidebarGroupLabel>
            <SidebarMenu>
                {organizedspaces?.map((item) => {
                    const Icon = item.icon;
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
                                        <div className="group/menu-item group/item">
                                            <ChevronRight className="hidden group-hover/item:block transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            {!!Icon && (
                                                <Icon className="block group-hover/item:hidden" />
                                            )}
                                            <Link to={item.url}>
                                                <span>{item.title}</span>
                                            </Link>
                                            {item.title !== 'Archived' && (
                                                <AddMemory
                                                    spaceId={item.id}
                                                    workspaceId={
                                                        selectedWorkspaceId as string
                                                    }
                                                />
                                            )}
                                            <ProjectMenu
                                                isMobile={isMobile}
                                                spaceId={item.id}
                                            />
                                        </div>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="mr-0 pr-0">
                                        <MemoryList
                                            spaceId={item.id}
                                            workspaceId={
                                                selectedWorkspaceId as string
                                            }
                                            isMobile={isMobile}
                                        />
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
