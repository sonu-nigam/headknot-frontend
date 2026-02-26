import { Value } from 'platejs';
import { Plate, PlateEditor, usePlateEditor } from 'platejs/react';
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
import {
    H1Element,
    H2Element,
    H3Element,
} from '@workspace/ui/components/heading-node';
import { BlockquoteElement } from '@workspace/ui/components/blockquote-node';
import {
    Block,
    blocksToEditor,
    editorToBlocks,
} from '@/lib/editorValueTransformer';

interface PlateEditorProps {
    initialValue: Block[];
    onChange?: (blocks: Block[]) => void;
    placeholder?: string;
}

export function MainEditor({
    initialValue,
    onChange,
    placeholder = 'Describe your content here...',
}: PlateEditorProps) {
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

    const handleDocChange = ({
        value,
        editor,
    }: {
        value: Value;
        editor: PlateEditor;
    }) => {
        if (onChange) {
            const formattedBlocks = editorToBlocks(value, editor);
            onChange(formattedBlocks);
        }
    };

    return (
        <Plate editor={editor} onChange={handleDocChange}>
            <EditorContainer>
                <Editor
                    placeholder={placeholder}
                    className="px-4 sm:px-4 pt-0 pb-96 [&>*:first-child]:mt-0"
                    // renderPlaceholder={({ children }) => <div>{children}</div>}
                />
            </EditorContainer>
        </Plate>
    );
}
