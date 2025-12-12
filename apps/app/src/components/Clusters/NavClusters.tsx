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
import { clusterQueryOptions } from '@/query/options/cluster';
import { useAppStore } from '@/state/store';
import { useQuery } from '@tanstack/react-query';
import { AddMemory } from './AddMemory';
import { ProjectMenu } from './ProjectMenu';
import { MemoryList } from './MemoryList';
import { AddCluster } from '@/forms/Cluster/AddCluster';

export function NavClusters() {
    const { isMobile } = useSidebar();
    const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);

    const { data: workspaceClusters } = useQuery({
        ...clusterQueryOptions({
            workspaceId: selectedWorkspaceId as string,
            status: 'ACTIVE',
        }),
        enabled: !!selectedWorkspaceId,
    });

    const clusters = workspaceClusters?.map((cluster) => ({
        id: cluster.id as string,
        title: cluster.name as string,
        url: `/clusters/${cluster.id}` as string,
        icon: Folder as LucideIcon,
        isActive: false as boolean,
    }));

    const organizedClusters = clusters?.reduce(
        (acc, cluster) => {
            const isArchived = cluster.title
                .toLowerCase()
                .startsWith('archived');
            const isUnassigned = cluster.title
                .toLowerCase()
                .startsWith('unassigned');

            if (isArchived) return acc;

            if (isUnassigned) {
                return [cluster, ...acc];
            } else {
                return [...acc, cluster];
            }
        },
        [] as typeof clusters,
    );

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex justify-between">
                Clusters
                <AddCluster>
                    <Button size="icon" variant="secondary" className="size-6">
                        <Plus />
                    </Button>
                </AddCluster>
            </SidebarGroupLabel>
            <SidebarMenu>
                {organizedClusters?.map((item) => {
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
                                                    clusterId={item.id}
                                                    workspaceId={
                                                        selectedWorkspaceId as string
                                                    }
                                                />
                                            )}
                                            <ProjectMenu
                                                isMobile={isMobile}
                                                clusterId={item.id}
                                            />
                                        </div>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="mr-0 pr-0">
                                        <MemoryList
                                            clusterId={item.id}
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
