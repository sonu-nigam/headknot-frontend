import { Plate, usePlateEditor } from 'platejs/react';

import {
    BlockquotePlugin,
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    ItalicPlugin,
    UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { Editor, EditorContainer } from '@workspace/ui/components/editor';
import { Value } from 'platejs';
import {
    Block,
    blocksToEditor,
    editorToBlocks,
} from '@/lib/editorValueTransformer';
import { FixedToolbar } from '@workspace/ui/components/fixed-toolbar';
import { MarkToolbarButton } from '@workspace/ui/components/mark-toolbar-button';
import {
    H1Element,
    H2Element,
    H3Element,
} from '@workspace/ui/components/heading-node';
import { BlockquoteElement } from '@workspace/ui/components/blockquote-node';
import { ToolbarButton } from '@workspace/ui/components/toolbar';
import { Separator } from '@workspace/ui/components/separator';
import { useThrottleFn } from 'ahooks';
import { useMutation } from '@tanstack/react-query';
import { api } from '@workspace/api-client';

export function Content({
    initialValue,
    memoryId,
}: {
    initialValue: Block[];
    memoryId: string;
}) {
    const editor = usePlateEditor({
        value: blocksToEditor(initialValue),
        plugins: [
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],
        nodeId: { idCreator: () => self.crypto.randomUUID() },
    });

    const handleChange = async ({ value }: { value: Value }) => {
        const formattedValue = editorToBlocks(value);

        await capture.mutateAsync({
            blocks: formattedValue,
        });
    };

    const capture = useMutation({
        mutationFn: async ({ blocks }: { blocks: any[] }) => {
            const { error, data } = await api.PUT('/memory/{id}/blocks', {
                params: {
                    path: {
                        id: memoryId || '',
                    },
                },
                body: {
                    blocks,
                },
            });
            if (error) throw error;
            return data;
        },
    });

    const handleChangeThrottled = useThrottleFn(handleChange, { wait: 1000 });

    return (
        <Plate editor={editor} onChange={handleChangeThrottled.run}>
            <EditorContainer>
                <Editor
                    placeholder="Describe your content here..."
                    className="px-4 sm:px-4 pt-0 pb-96 [&>*:first-child]:mt-0"
                />
            </EditorContainer>
            {/*<FixedToolbar className="justify-center rounded-lg bg-accent mb-4 border-0 w-min mx-auto fixed bottom-20 top-auto left-1/2 -translate-x-1/2">
                <ToolbarButton onClick={() => editor.tf.h1.toggle()}>
                    H1
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.h2.toggle()}>
                    H2
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.h3.toggle()}>
                    H3
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>
                    Quote
                </ToolbarButton>
                <Separator orientation="vertical" />
                <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
                    B
                </MarkToolbarButton>
                <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
                    I
                </MarkToolbarButton>
                <MarkToolbarButton
                    nodeType="underline"
                    tooltip="Underline (⌘+U)"
                >
                    U
                </MarkToolbarButton>
            </FixedToolbar>*/}
        </Plate>
    );
}
