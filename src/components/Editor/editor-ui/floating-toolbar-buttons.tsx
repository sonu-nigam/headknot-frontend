"use client";

import { withRef } from "@udecode/cn";
import React from "react";
import {
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import {
    useEditorReadOnly,
    useEditorRef,
    useMarkToolbarButton,
    useMarkToolbarButtonState,
} from "@udecode/plate/react";
import {
    ActionIcon,
    Button,
    ColorSwatch,
    Divider,
    Group,
    Popover,
    SimpleGrid,
    Text,
    ThemeIcon,
} from "@mantine/core";
import {
    IconBold,
    IconChevronDown,
    IconCode,
    IconDots,
    IconItalic,
    IconLink,
    IconMessagePlus,
    IconPalette,
    IconSquareRoot,
    IconStrikethrough,
    IconSubscript,
    IconSuperscript,
    IconUnderline,
    IconWand,
} from "@tabler/icons-react";
import { BlockItemOptions } from "./block-selector";
import { AlignDropdown } from "./align-dropdown";
import { LinkToolbarButton } from "./link-toolbar-button";
import ColorDropdownMenu from "./color-dropdown-menu";
import { insertInlineEquation } from "@udecode/plate-math";

export function FloatingToolbarButtons() {
    const readOnly = useEditorReadOnly();
    const editor = useEditorRef();

    return (
        <>
            {!readOnly && (
                <Group gap={4}>
                    <BlockItemOptions />
                    <Divider orientation="vertical" />
                    <Group gap={0}>
                        <ActionIcon.Group>
                            <MarkToolbarButton nodeType={BoldPlugin.key}>
                                <IconBold size={16} stroke={2} />
                            </MarkToolbarButton>
                            <MarkToolbarButton nodeType={ItalicPlugin.key}>
                                <IconItalic size={16} stroke={2} />
                            </MarkToolbarButton>
                            <MarkToolbarButton nodeType={UnderlinePlugin.key}>
                                <IconUnderline size={16} stroke={2} />
                            </MarkToolbarButton>
                        </ActionIcon.Group>
                        <Popover withinPortal={false}>
                            <Popover.Target>
                                <ActionIcon
                                    variant="subtle"
                                    aria-label="Settings"
                                    className="rounded-s-none"
                                    style={{
                                        width: "var(--ai-size-xs)",
                                        minWidth: "var(--ai-size-xs)",
                                    }}
                                >
                                    <IconChevronDown size={16} stroke={1.5} />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown p={4}>
                                <Group gap={4}>
                                    <MarkToolbarButton
                                        nodeType={StrikethroughPlugin.key}
                                    >
                                        <IconStrikethrough
                                            size={16}
                                            stroke={2}
                                        />
                                    </MarkToolbarButton>
                                    <MarkToolbarButton
                                        nodeType={CodePlugin.key}
                                    >
                                        <IconCode size={16} stroke={2} />
                                    </MarkToolbarButton>
                                    <MarkToolbarButton
                                        nodeType={SubscriptPlugin.key}
                                    >
                                        <IconSubscript size={16} stroke={2} />
                                    </MarkToolbarButton>
                                    <MarkToolbarButton
                                        nodeType={SuperscriptPlugin.key}
                                    >
                                        <IconSuperscript size={16} stroke={2} />
                                    </MarkToolbarButton>
                                    <ActionIcon
                                        onClick={() => insertInlineEquation(editor)}
                                        variant="subtle"
                                    >
                                        <IconSquareRoot size={16} stroke={2} />
                                    </ActionIcon>
                                </Group>
                            </Popover.Dropdown>
                        </Popover>
                    </Group>
                    <Divider orientation="vertical" />
                    <AlignDropdown />
                    <LinkToolbarButton />
                    <ColorDropdownMenu />
                    {/* <ActionIcon variant="subtle">
                        <IconMessagePlus size={16} stroke={2} />
                    </ActionIcon>
                    <Divider orientation="vertical" />
                    <ActionIcon variant="subtle">
                        <IconWand size={16} stroke={2} />
                    </ActionIcon>
                    <Divider orientation="vertical" />
                    <ActionIcon variant="subtle">
                        <IconDots stroke={2} size={16} />
                    </ActionIcon> */}
                </Group>
            )}
        </>
    );
}

const MarkToolbarMenuItem = withRef<
    typeof Button,
    {
        nodeType: string;
        clear?: string[] | string;
        children: React.ReactNode;
    } & typeof Button
>(({ clear, nodeType, ...rest }, ref) => {
    const state = useMarkToolbarButtonState({ clear, nodeType });
    const {
        props: { pressed, ...restProps },
    } = useMarkToolbarButton(state);

    return (
        <Button
            ref={ref}
            variant={pressed ? "light" : "subtle"}
            {...restProps}
            {...rest}
        />
    );
});

export const MarkToolbarButton = withRef<
    typeof ActionIcon,
    {
        nodeType: string;
        clear?: string[] | string;
        children: React.ReactNode;
    }
>(({ clear, nodeType, ...rest }, ref) => {
    const state = useMarkToolbarButtonState({ clear, nodeType });
    const {
        props: { pressed, ...restProps },
    } = useMarkToolbarButton(state);

    return (
        <ActionIcon
            ref={ref}
            variant={pressed ? "light" : "subtle"}
            {...restProps}
            {...rest}
        />
    );
});
