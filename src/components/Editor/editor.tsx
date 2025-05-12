"use client";

import { Plate } from "@udecode/plate/react";
import { editorComponents, useEditor } from "@/hooks/useEditor/useEditor";
import { Editor, EditorContainer } from "./editor-ui/editor";
import { serializeHtml } from "@udecode/plate";

export function PlateEditor({content, onUpdate}: {
    content: string;
    onUpdate: (value: string) => void
}) {
    const editor = useEditor({
        value: content,
    });
    const onChange = async () => {
        const htmlString = await serializeHtml(editor, {
            components: editorComponents,
            stripClassNames: true,
            preserveClassNames: ['slate-'],
            stripDataAttributes: true,
          });
        onUpdate(htmlString)
    }
    return (
        <Plate editor={editor} onChange={onChange}>
            <EditorContainer>
                <Editor variant="demo" placeholder="Type..." />
            </EditorContainer>
        </Plate>
    );
}
