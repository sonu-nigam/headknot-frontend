"use client";
import Text from "@tiptap/extension-text";
import { EditorContent, Node, useEditor } from "@tiptap/react";
import React from "react";

type Props = {};

const Document = Node.create({
    name: "doc",
    topNode: true,
    content: "block+",
});

const Title = Node.create({
    name: "doc",
    topNode: true,
    content: "block+",
    parseHTML() {
        return [{ tag: "div" }];
    },
    renderHTML({ HTMLAttributes }) {
        return ["div", HTMLAttributes, 0];
    },
});
function EditorHeader({}: Props) {
    const editor = useEditor({
        extensions: [Text, Document],
        content: "kdkfdk",
    });

    return <EditorContent editor={editor} />;
}

export default EditorHeader;
