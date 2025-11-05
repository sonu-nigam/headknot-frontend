import { BookCopyIcon, CombineIcon, PlusIcon } from 'lucide-react';
import { ControllerRenderProps } from 'react-hook-form';
import {
    Plate,
    PlateCorePlugin,
    TPlateEditor,
    usePlateEditor,
} from 'platejs/react';

import {
    BlockquotePlugin,
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    ItalicPlugin,
    UnderlinePlugin,
} from '@platejs/basic-nodes/react';

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
import { Value } from 'platejs';
import { editorToBlocks } from '@/lib/editorValueTransformer';
import { FixedToolbar } from '@workspace/ui/components/fixed-toolbar';
import { MarkToolbarButton } from '@workspace/ui/components/mark-toolbar-button';
import {
    H1Element,
    H2Element,
    H3Element,
} from '@workspace/ui/components/heading-node';
import { BlockquoteElement } from '@workspace/ui/components/blockquote-node';

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
            {/*<FormLabel htmlFor="title">Title</FormLabel>*/}
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
    const editor = usePlateEditor({
        value: field.value as Value,
        plugins: [
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],
    });

    const handleChange = ({
        value,
    }: {
        editor: TPlateEditor<Value, PlateCorePlugin>;
        value: Value;
    }) => {
        const formattedValue = editorToBlocks(value);
        field.onChange(formattedValue);
    };

    return (
        <FormItem>
            {/*<FormLabel>Description</FormLabel>*/}
            <FormControl>
                <Plate editor={editor} onChange={handleChange}>
                    <FixedToolbar className="justify-start rounded-t-lg">
                        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
                            B
                        </MarkToolbarButton>
                        <MarkToolbarButton
                            nodeType="italic"
                            tooltip="Italic (⌘+I)"
                        >
                            I
                        </MarkToolbarButton>
                        <MarkToolbarButton
                            nodeType="underline"
                            tooltip="Underline (⌘+U)"
                        >
                            U
                        </MarkToolbarButton>
                    </FixedToolbar>
                    <EditorContainer>
                        <Editor
                            placeholder="Describe your content here..."
                            className="p-0 sm:p-0"
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
