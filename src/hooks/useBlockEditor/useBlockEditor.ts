import { useEditor } from "@tiptap/react";
import type { AnyExtension, Editor, EditorOptions } from "@tiptap/core";
import { ExtensionKit } from "@/extensions/extension-kit";

declare global {
    interface Window {
        editor: Editor | null;
    }
}

export const useBlockEditor = ({
    content,
    ...editorOptions
}: {} & Partial<Omit<EditorOptions, "extensions">>) => {
    const editor = useEditor(
        {
            ...editorOptions,
            immediatelyRender: false,
            shouldRerenderOnTransaction: false,
            autofocus: true,
            content,
            extensions: [...ExtensionKit()].filter(
                (e): e is AnyExtension => e !== undefined,
            ),
            editorProps: {
                attributes: {
                    autocomplete: "off",
                    autocorrect: "off",
                    autocapitalize: "off",
                    class: "min-h-full",
                },
            },
        },
        [],
    );

    return { editor };
};
