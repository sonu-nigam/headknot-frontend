import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { format } from 'date-fns/format';
import { FileClockIcon, MessageCircleIcon, NetworkIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { Separator } from '@workspace/ui/components/separator';
import { contextPanelStore } from '@/state/contextPanelStore';
import { useRelationshipsPanelStore } from '@/state/relationshipsPanelStore';

interface MemoryHeaderProps {
    memoryId?: string;
}

export function MemoryHeader({ memoryId }: MemoryHeaderProps) {
    return (
        <div className="mb-4 px-12">
            <div className="flex justify-between  items-center">
                <div className="flex items-center">
                    <MemoryEditedBy />
                </div>
                <MemoryActions memoryId={memoryId} />
            </div>
            <Separator className="mt-6 px-12" />
        </div>
    );
}

function MemoryActions({ memoryId }: { memoryId?: string }) {
    const openMemoryView = useRelationshipsPanelStore(
        (s) => s.openMemoryView,
    );
    const closeRelationships = useRelationshipsPanelStore((s) => s.close);
    const relationshipsView = useRelationshipsPanelStore((s) => s.view);

    const handleToggle = (value: string) => {
        if (value === 'relations') {
            if (memoryId) {
                openMemoryView(memoryId);
                contextPanelStore.open('Relationships');
            }
        } else if (value === 'comments') {
            closeRelationships();
            contextPanelStore.open('Comments');
        } else {
            // Deselected — close panel
            closeRelationships();
            contextPanelStore.close();
        }
    };

    return (
        <div className="flex gap-2">
            <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={
                    relationshipsView === 'memory'
                        ? 'relations'
                        : undefined
                }
                onValueChange={handleToggle}
            >
                <ToggleGroupItem value="relations" aria-label="Toggle relations">
                    <NetworkIcon className="group-data-[state=on]/toggle:fill-foreground" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="comments"
                    aria-label="Toggle comments"
                >
                    <MessageCircleIcon className="group-data-[state=on]/toggle:fill-foreground" />
                </ToggleGroupItem>
            </ToggleGroup>
            <MemoryTimeline />
        </div>
    );
}

function MemoryEditedBy() {
    return (
        <>
            <MemoryEditedByAvatar />
            &nbsp;&nbsp;
            <MemoryActionOccuredAt />
        </>
    );
}

function MemoryEditedByAvatar() {
    const alt = 'Memory creator';
    const src = '';
    const fallback = alt.slice(0, 2).toUpperCase();

    return (
        <Avatar size="lg">
            <AvatarImage src={src} alt={alt} />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    );
}

function MemoryActionOccuredAt() {
    return (
        <span className="text-sm text-muted-foreground">
            <time className="text-sm text-muted-foreground">
                {format(Date.now(), 'MMM dd, yyyy')}
            </time>
        </span>
    );
}

function MemoryTimeline() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="default">
                    <FileClockIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-40 max-h-60 overflow-y-auto"
                align="start"
            >
                {Array.from({ length: 25 }).map((_, i) => (
                    <DropdownMenuItem key={i}>
                        {format(
                            Date.now() - i * 1000 * 60 * 60 * 24,
                            'dd MMM yyyy',
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
