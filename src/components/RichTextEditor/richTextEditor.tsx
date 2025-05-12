import React, { useState } from "react";
import { BubbleMenu, EditorContent } from "@tiptap/react";
import Toolbar from "./Toolbar/toolbar";
import { useBlockEditor } from "@/hooks/useBlockEditor/useBlockEditor";
import "@mantine/tiptap/styles.css";
import { Box } from "@mantine/core";

type Props = {
    content: string;
    onUpdate: any;
};

function Editor({ content, onUpdate }: Props) {
    const [isEditable, setIsEditable] = useState(true);

    const { editor } = useBlockEditor({
        onUpdate,
        content,
        onTransaction({ editor: currentEditor }) {
            setIsEditable(currentEditor.isEditable);
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <Box w="100%">
            {editor && (
                <BubbleMenu editor={editor}>
                    <Toolbar editor={editor} />
                </BubbleMenu>
            )}
            <EditorContent editor={editor} />
        </Box>
    );
}

export default Editor;
