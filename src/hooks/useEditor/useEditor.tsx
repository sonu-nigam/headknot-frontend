import { useEditor as useTipTapEditor } from "@tiptap/react";
import { mergeAttributes, Node } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";

const useEditor = ({ content }: { content: string }) => {
    const editor = useTipTapEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Placeholder],
        content,
    });
    return editor;
};

export default useEditor;
