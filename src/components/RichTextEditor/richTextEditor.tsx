import React, { useRef, useState } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { FloatingMenu, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import { ActionIcon, Box } from "@mantine/core";
import {
    IconBold,
    IconDotsVertical,
    IconGripVertical,
} from "@tabler/icons-react";
import { DragMenu } from "./DragMenu/DragMenu";
import EditorBlockMenu from "../ContextMenu/EditorBlockMenu";
import Toolbar from "./Toolbar/toolbar";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Commands from "./Commands";
import { suggestion } from "./suggestion";
import { useBlockEditor } from "@/hooks/useBlockEditor/useBlockEditor";

type Props = {
    content: string;
    onUpdate: any;
};

const CustomDocument = Document.extend({
    content: "heading block*",
});

function Editor({ content, onUpdate }: Props) {
    const [isEditable, setIsEditable] = useState(true);

    const { editor } = useBlockEditor({
        onTransaction({ editor: currentEditor }) {
            setIsEditable(currentEditor.isEditable);
        },
    });

    if (!editor) {
        return null;
    }

    // const editor = useEditor({
    //     immediatelyRender: false,
    //     extensions: [
    //         StarterKit.configure({
    //             document: false,
    //         }),
    //         CustomDocument,
    //         Image,
    //         Commands.configure({
    //             suggestion,
    //         }),
    //         Link.configure({
    //             openOnClick: false,
    //             autolink: true,
    //             defaultProtocol: "https",
    //             protocols: ["http", "https"],
    //             isAllowedUri: (url: string, ctx: any) => {
    //                 try {
    //                     // construct URL
    //                     const parsedUrl = url.includes(":")
    //                         ? new URL(url)
    //                         : new URL(`${ctx.defaultProtocol}://${url}`);
    //
    //                     // use default validation
    //                     if (!ctx.defaultValidate(parsedUrl.href)) {
    //                         return false;
    //                     }
    //
    //                     // disallowed protocols
    //                     const disallowedProtocols = ["ftp", "file", "mailto"];
    //                     const protocol = parsedUrl.protocol.replace(":", "");
    //
    //                     if (disallowedProtocols.includes(protocol)) {
    //                         return false;
    //                     }
    //
    //                     // only allow protocols specified in ctx.protocols
    //                     const allowedProtocols = ctx.protocols.map((p: any) =>
    //                         typeof p === "string" ? p : p.scheme,
    //                     );
    //
    //                     if (!allowedProtocols.includes(protocol)) {
    //                         return false;
    //                     }
    //
    //                     // disallowed domains
    //                     const disallowedDomains = [
    //                         "example-phishing.com",
    //                         "malicious-site.net",
    //                     ];
    //                     const domain = parsedUrl.hostname;
    //
    //                     if (disallowedDomains.includes(domain)) {
    //                         return false;
    //                     }
    //
    //                     // all checks have passed
    //                     return true;
    //                 } catch {
    //                     return false;
    //                 }
    //             },
    //             shouldAutoLink: (url: string) => {
    //                 try {
    //                     // construct URL
    //                     const parsedUrl = url.includes(":")
    //                         ? new URL(url)
    //                         : new URL(`https://${url}`);
    //
    //                     // only auto-link if the domain is not in the disallowed list
    //                     const disallowedDomains = [
    //                         "example-no-autolink.com",
    //                         "another-no-autolink.com",
    //                     ];
    //                     const domain = parsedUrl.hostname;
    //
    //                     return !disallowedDomains.includes(domain);
    //                 } catch {
    //                     return false;
    //                 }
    //             },
    //         }),
    //         Placeholder.configure({
    //             showOnlyWhenEditable: false,
    //             showOnlyCurrent: false,
    //             placeholder: ({ node }) => {
    //                 if (node.type.name === "heading") {
    //                     return "What’s the title?";
    //                 }
    //
    //                 return "Can you add some further context?";
    //             },
    //         }),
    //     ],
    //     content,
    //     onUpdate,
    // });
    //

    return (
        <RichTextEditor
            bd={0}
            editor={editor}
            style={{ height: "100%", paddingBottom: "30%" }}
        >
            {editor && (
                <DragMenu
                    editor={editor}
                    tippyOptions={{
                        placement: "left-start",
                        appendTo: "parent",
                        getReferenceClientRect: () => {
                            const { selection } = editor.state;
                            if (selection) {
                                const blockStart = selection.$from.start();
                                const dom =
                                    editor.view.domAtPos(blockStart).node;
                                if (dom) {
                                    const rect = (
                                        dom as HTMLElement
                                    )?.getBoundingClientRect();
                                    return rect;
                                }
                            }

                            return editor.view.dom.getBoundingClientRect();
                        },
                    }}
                    className="flex items-center"
                    shouldShow={({ state }) => {
                        const { selection } = state;
                        const pos = selection.anchor;
                        const parentNode = editor.state.doc.resolve(pos).parent;
                        if (parentNode && parentNode.attrs.level == 1) {
                            return false;
                        }
                        return true;
                    }}
                >
                    <EditorBlockMenu>
                        <ActionIcon
                            variant="light"
                            color="teal"
                            size="sm"
                            radius="xs"
                        >
                            <IconGripVertical size={16} stroke={2} />
                        </ActionIcon>
                    </EditorBlockMenu>
                </DragMenu>
            )}
            {editor && <Toolbar editor={editor} />}
            <RichTextEditor.Content />
        </RichTextEditor>
    );
}

export default Editor;
