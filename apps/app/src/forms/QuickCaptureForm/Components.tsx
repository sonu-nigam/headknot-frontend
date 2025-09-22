import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { BookCopyIcon, CombineIcon, PlusIcon } from 'lucide-react';

export function TypeSelector() {
    return (
        <Select>
            <SelectTrigger size="sm">
                <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
                {'Note,Meeting,Task,Decision,File'.split(',').map((v) => (
                    <SelectItem key={v} value={v}>
                        {v}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function VisibilitySelector() {
    return (
        <Select>
            <SelectTrigger size="sm">
                <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
                {'Public,Private'.split(',').map((v) => (
                    <SelectItem key={v} value={v}>
                        {v}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function Title() {
    return (
        <>
            <Label htmlFor="title">Title</Label>
            <Input
                id="title"
                autoFocus
                placeholder="e.g., Outbox pattern notes"
            />
        </>
    );
}

export function Description() {
    return (
        <>
            <Label htmlFor="content">Description</Label>
            <Textarea
                id="content"
                placeholder="Write here. Use / for blocks; uploads become inline blocks."
                className="min-h-[160px]"
            />
        </>
    );
}

export function Tags() {
    return (
        <div className="grid gap-2">
            {/*<Label>Tags</Label>*/}
            <div className="flex flex-wrap gap-2">
                {['book', 'pen', 'car'].map((t) => (
                    <Badge
                        key={t}
                        variant="secondary"
                        className="cursor-pointer"
                    >
                        #{t}
                    </Badge>
                ))}
                <Badge variant="secondary" className="cursor-pointer">
                    <PlusIcon />
                    Add Tag
                </Badge>
            </div>
        </div>
    );
}

export function PartOf() {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="secondary">
                    <CombineIcon />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Part of</p>
            </TooltipContent>
        </Tooltip>
    );
}

export function References() {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="secondary">
                    <BookCopyIcon />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>References</p>
            </TooltipContent>
        </Tooltip>
    );
}
