import { BookCopyIcon, CombineIcon, PlusIcon } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';
import { Plate, usePlateEditor } from 'platejs/react';

import { MEMORY_TYPES, VISIBILITY_TYPES } from '@/constants/common';
import { QuickCaptureFormValues } from '@/validations/form/QuickCaptureForm';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@workspace/ui/components/form';
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
import { Editor, EditorContainer } from '@workspace/ui/components/editor';

export function TypeSelector({ ...field }: ControllerRenderProps) {
    return (
        <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger size="sm">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {MEMORY_TYPES.map((v) => (
                        <SelectItem key={v} value={v}>
                            {v}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    );
}

export function VisibilitySelector({ ...field }: ControllerRenderProps) {
    return (
        <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger size="sm">
                        <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {VISIBILITY_TYPES.map((v) => (
                        <SelectItem key={v} value={v}>
                            {v}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
    );
}

export function Title({ ...field }: ControllerRenderProps) {
    return (
        <FormItem>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl>
                <Input
                    id="title"
                    autoFocus
                    placeholder="e.g., Outbox pattern notes"
                    {...field}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}

export function Description({ ...field }: ControllerRenderProps) {
    const editor = usePlateEditor();
    return (
        <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
                {/*<Textarea
                    id="description"
                    placeholder="Write here. Use / for blocks; uploads become inline blocks."
                    className="min-h-[160px]"
                    {...field}
                />*/}
                <Plate editor={editor}>
                    <EditorContainer>
                        <Editor
                            placeholder="Describe your content here..."
                            className="px-4 sm:px-4 border rounded-md"
                        />
                    </EditorContainer>
                </Plate>
            </FormControl>
            <FormMessage />
        </FormItem>
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
