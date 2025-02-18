"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { mergeAttributes, Node, useEditor, FloatingMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import { Paper } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

const content =
    "<h1>It’ll always have a heading … </h1><p> … if you pass a custom document. That’s the beauty of having full control over the schema.</p>";

const CustomDocument = Document.extend({
    content: "heading block*",
});

export default function Home() {
    const inputRef = useRef<HTMLInputElement>(null);
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Placeholder],
        content,
        onSelectionUpdate({ editor, transaction }) {
            // console.log(editor, transaction);
        },
    });

    return (
        <Paper maw={680} mx="auto">
            <input
                type="text"
                placeholder="Add title"
                ref={inputRef}
                className="w-full text-5xl font-bold outline-none focus:outline-none p-4"
            />
            <RichTextEditor editor={editor} bd={0}>
                {editor && (
                    <FloatingMenu
                        editor={editor}
                        tippyOptions={{ placement: "top-start" }}
                    >
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.BulletList />
                        </RichTextEditor.ControlsGroup>
                    </FloatingMenu>
                )}
                <RichTextEditor.Content />
            </RichTextEditor>
        </Paper>
    );
}
