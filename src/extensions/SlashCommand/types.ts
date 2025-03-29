import { Icon, IconProps } from "@tabler/icons-react";
import { Editor } from "@tiptap/core";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface Group {
    name: string;
    title: string;
    commands: Command[];
}

export interface Command {
    name: string;
    label: string;
    description: string;
    aliases?: string[];
    icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
    action: (editor: Editor) => void;
    shouldBeHidden?: (editor: Editor) => boolean;
}

export interface MenuListProps {
    editor: Editor;
    items: Group[];
    command: (command: Command) => void;
}
