import { ActionIcon, Box, Button, Divider, Select } from "@mantine/core";
import {
    Icon,
    IconAlignCenter,
    IconAlignJustified,
    IconAlignLeft,
    IconAlignRight,
    IconBold,
    IconCode,
    IconDots,
    IconItalic,
    IconLink,
    IconProps,
    IconSourceCode,
    IconStrikethrough,
    IconUnderline,
} from "@tabler/icons-react";
import TextAlign from "@tiptap/extension-text-align";
import { Editor } from "@tiptap/react";
import React, {
    ForwardRefExoticComponent,
    RefAttributes,
    useCallback,
} from "react";

type Props = {
    editor: Editor;
};

function Toolbar({ editor }: Props) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();

            return;
        }

        // update link
        try {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        } catch (e: any) {
            alert(e.message);
        }
    }, [editor]);

    return (
        <Box
            bg="gray.1"
            style={{
                gap: 2,
                padding: 4,
                borderRadius: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
            }}
        >
            <ToolbarIcon
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                icon={IconBold}
            />
            <ToolbarIcon
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                icon={IconItalic}
            />
            <ToolbarIcon
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive("underline")}
                icon={IconUnderline}
            />
            <ToolbarIcon
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive("strike")}
                icon={IconStrikethrough}
            />
            <ToolbarIcon
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive("code")}
                icon={IconCode}
            />
            <ToolbarIcon
                onClick={setLink}
                active={editor.isActive("link")}
                icon={IconLink}
            />
            <ToolbarIcon
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                active={editor.isActive({ textAlign: "left" })}
                icon={IconAlignLeft}
            />
            <ToolbarIcon
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                active={editor.isActive({ textAlign: "center" })}
                icon={IconAlignCenter}
            />
            <ToolbarIcon
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                active={editor.isActive({ textAlign: "right" })}
                icon={IconAlignRight}
            />
            <ToolbarIcon
                onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                }
                active={editor.isActive({ textAlign: "justify" })}
                icon={IconAlignJustified}
            />
            <ActionIcon variant="subtle">
                <IconDots size={16} stroke={1.5} />
            </ActionIcon>
        </Box>
    );
}

export default Toolbar;

function ToolbarIcon({
    onClick,
    active,
    icon,
}: {
    onClick: () => void;
    active: boolean;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}) {
    const Icon = icon;
    return (
        <ActionIcon onClick={onClick} variant={active ? "light" : "subtle"}>
            <Icon stroke={1.5} size={16} />
        </ActionIcon>
    );
}
