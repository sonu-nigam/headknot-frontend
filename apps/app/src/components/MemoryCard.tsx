import { Button } from '@workspace/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    FileIcon,
    Link2Icon,
    MessagesSquareIcon,
    MoreVertical,
    SquareCheckBigIcon,
    TextIcon,
} from 'lucide-react';

type Memory = { id: string; title: string; updatedAt: string; type: string };

export function CompactMemoryCard({ item }: { item: Memory }) {
    const { type, title } = item;
    return (
        <div className="flex items-center gap-2 px-4 py-1.5">
            {type === 'note' && <TextIcon size={16} />}
            {type === 'file' && <FileIcon size={16} />}
            {type === 'task' && <SquareCheckBigIcon size={16} />}
            {type === 'link' && <Link2Icon size={16} />}
            {type === 'conversation' && <MessagesSquareIcon size={16} />}
            <a href="#" className="text-sm mr-auto">
                {title}
            </a>
            <div className="text-xs">
                {new Date(item.updatedAt).toLocaleString()}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="size-6">
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
