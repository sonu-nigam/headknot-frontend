import { Archive, Folder, Forward, MoreHorizontal, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { SidebarMenuAction } from '@workspace/ui/components/sidebar';
import { useMutation } from '@tanstack/react-query';
import { deleteMemoryQueryOptions } from '@/query/options/memory';
import { api } from '@workspace/api-client';

export function MemoryMenu({
    isMobile,
    memoryId,
}: {
    isMobile: boolean;
    memoryId: string;
}) {
    const archiveMemory = useMutation({
        mutationFn: async (id: string) => {
            const { error, data } = await api.PATCH('/memory/{id}/archive', {
                params: {
                    path: {
                        id,
                    },
                },
            });
            if (error) throw error;
            return data;
        },
    });

    const trashMemory = useMutation({
        mutationFn: async (id: string) => {
            const { error, data } = await api.DELETE('/memory/{id}', {
                params: {
                    path: {
                        id,
                    },
                },
            });
            if (error) throw error;
            return data;
        },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
            >
                {/*<DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>Publish</span>
                </DropdownMenuItem>*/}
                {/*<DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share</span>
                </DropdownMenuItem>*/}
                <DropdownMenuItem
                    onSelect={() => archiveMemory.mutate(memoryId)}
                >
                    <Archive className="text-muted-foreground" />
                    <span>Archive Memory</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => trashMemory.mutate(memoryId)}>
                    <Archive className="text-muted-foreground" />
                    <span>Trash Memory</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
