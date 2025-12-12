import {
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@workspace/ui/components/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { memoryListQueryOptions } from '@/query/options/memory';
import { convertMemoryIdToSlug } from '@/lib/memoryUtils';
import { MemoryMenu } from './MemoryMenu';

export function MemoryList({
    clusterId,
    workspaceId,
    isMobile,
}: {
    clusterId: string;
    workspaceId: string;
    isMobile: boolean;
}) {
    const navigate = useNavigate();
    const { data: memoryList, isLoading: memoryListLoading } = useSuspenseQuery(
        {
            ...memoryListQueryOptions({
                clusterId,
                workspaceId,
                status: 'ACTIVE',
            }),
            select: (data) =>
                data.map((memory) => ({
                    id: memory.id,
                    title: memory.title,
                    url: `/${convertMemoryIdToSlug(memory.id as string)}`,
                })),
        },
    );

    if (!memoryList.length) {
        return (
            <SidebarMenuSubItem className="group/menu-item">
                <SidebarMenuSubButton>No Memory found</SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return memoryList.map((memory) => (
        <SidebarMenuSubItem key={memory.id} className="group/menu-item">
            <SidebarMenuSubButton asChild>
                <Link to={memory.url}>
                    <span>{memory.title || 'New Memory'}</span>
                </Link>
            </SidebarMenuSubButton>
            <MemoryMenu
                isMobile={isMobile}
                memoryId={memory.id as string}
                clusterId={clusterId}
            />
        </SidebarMenuSubItem>
    ));
}
