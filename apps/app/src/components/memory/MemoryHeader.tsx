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
    DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
    ToggleGroup,
    ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { Separator } from '@workspace/ui/components/separator';
import { contextPanelStore } from '@/state/contextPanelStore';
import { useRelationshipsPanelStore } from '@/state/relationshipsPanelStore';
import { SnapshotTimeline } from './Timeline';

interface MemoryHeaderProps {
    memoryId?: string;
    onEditorReload?: () => void;
}

export function MemoryHeader({ memoryId, onEditorReload }: MemoryHeaderProps) {
    return (
        <div className="mb-4 px-12">
            <div className="flex justify-between  items-center">
                <div className="flex items-center">
                    <MemoryEditedBy />
                </div>
                <MemoryActions memoryId={memoryId} onEditorReload={onEditorReload} />
            </div>
            <Separator className="mt-6 px-12" />
        </div>
    );
}

function MemoryActions({ memoryId, onEditorReload }: { memoryId?: string; onEditorReload?: () => void }) {
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
            <MemoryTimeline memoryId={memoryId} onEditorReload={onEditorReload} />
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

function MemoryTimeline({ memoryId, onEditorReload }: { memoryId?: string; onEditorReload?: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="default">
                    <FileClockIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 w-auto" align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                {memoryId ? (
                    <SnapshotTimeline
                        memoryId={memoryId}
                        onEditorReload={onEditorReload}
                    />
                ) : (
                    <div className="p-4 text-xs text-muted-foreground">
                        No memory selected
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
