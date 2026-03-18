import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns/format";
import { FileClockIcon, MessageCircleIcon, NetworkIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { Badge } from "@workspace/ui/components/badge";

export function MemoryHeader() {

    return (
        <>
            <div className="mb-4 px-4 flex justify-between">
                <div className="flex items-center">
                    <MemoryEditedBy />
                </div>
                <MemoryActions />
            </div>
        </>
    )
}

function MemoryActions() {
    return (
        <div className="flex gap-2">
            <ToggleGroup type="single" variant="outline" defaultValue="all" size="sm">
                <ToggleGroupItem value="relations" aria-label="Toggle all">
                    <NetworkIcon className="group-data-[state=on]/toggle:fill-foreground" />
                </ToggleGroupItem>
                <ToggleGroupItem value="comments" aria-label="Toggle missed">
                    <MessageCircleIcon className="group-data-[state=on]/toggle:fill-foreground" />
                </ToggleGroupItem>
            </ToggleGroup>
            <MemoryTimeline />
        </div>
    )
}

function MemoryEditedBy() {
    return (
        <>
            <MemoryEditedByAvatar />
            <MemoryActionOccuredAt />
        </>
    )
}

function MemoryEditedByAvatar() {
    const alt = "Memory creator";
    const src = "";
    const fallback = alt.slice(0, 2).toUpperCase();

    return (
        <Avatar size='sm'>
            <AvatarImage
                src={src}
                alt={alt}
            />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}

function MemoryActionOccuredAt() {
    return (
        <span className="text-sm text-muted-foreground">
            &nbsp;created at:&nbsp;
            <time className="text-sm text-muted-foreground">
                {format(Date.now(), 'dd MMM yyyy')}
            </time>
        </span>
    )
}

function MemoryTimeline() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="default">
                    <FileClockIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 max-h-60 overflow-y-auto" align="start">
                {Array.from({ length: 25 }).map((_, i) => (
                    <DropdownMenuItem key={i}>
                        {format(Date.now() - i * 1000 * 60 * 60 * 24, 'dd MMM yyyy')}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
