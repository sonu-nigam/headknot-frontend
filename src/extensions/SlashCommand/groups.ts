import {
    IconBlockquote,
    IconDivide,
    IconH1,
    IconH2,
    IconH3,
    IconLayoutColumns,
    IconList,
    IconListCheck,
    IconListNumbers,
    IconPhoto,
    IconSourceCode,
    IconTable,
} from "@tabler/icons-react";
import { Group } from "./types";

export const GROUPS: Group[] = [
    {
        name: "format",
        title: "Format",
        commands: [
            {
                name: "heading1",
                label: "Heading 1",
                icon: IconH1,
                description: "High priority section title",
                aliases: ["h1"],
                action: (editor) => {
                    editor.chain().focus().setHeading({ level: 1 }).run();
                },
            },
            {
                name: "heading2",
                label: "Heading 2",
                icon: IconH2,
                description: "Medium priority section title",
                aliases: ["h2"],
                action: (editor) => {
                    editor.chain().focus().setHeading({ level: 2 }).run();
                },
            },
            {
                name: "heading3",
                label: "Heading 3",
                icon: IconH3,
                description: "Low priority section title",
                aliases: ["h3"],
                action: (editor) => {
                    editor.chain().focus().setHeading({ level: 3 }).run();
                },
            },
            {
                name: "bulletList",
                label: "Bullet List",
                icon: IconList,
                description: "Unordered list of items",
                aliases: ["ul"],
                action: (editor) => {
                    editor.chain().focus().toggleBulletList().run();
                },
            },
            {
                name: "numberedList",
                label: "Numbered List",
                icon: IconListNumbers,
                description: "Ordered list of items",
                aliases: ["ol"],
                action: (editor) => {
                    editor.chain().focus().toggleOrderedList().run();
                },
            },
            {
                name: "taskList",
                label: "Task List",
                icon: IconListCheck,
                description: "Task list with todo items",
                aliases: ["todo"],
                action: (editor) => {
                    editor.chain().focus().toggleTaskList().run();
                },
            },
            {
                name: "blockquote",
                label: "Blockquote",
                icon: IconBlockquote,
                description: "Element for quoting",
                action: (editor) => {
                    editor.chain().focus().setBlockquote().run();
                },
            },
            {
                name: "codeBlock",
                label: "Code Block",
                icon: IconSourceCode,
                description: "Code block with syntax highlighting",
                shouldBeHidden: (editor) => editor.isActive("columns"),
                action: (editor) => {
                    editor.chain().focus().setCodeBlock().run();
                },
            },
        ],
    },
    {
        name: "insert",
        title: "Insert",
        commands: [
            {
                name: "table",
                label: "Table",
                icon: IconTable,
                description: "Insert a table",
                shouldBeHidden: (editor) => editor.isActive("columns"),
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                        .run();
                },
            },
            {
                name: "image",
                label: "Image",
                icon: IconPhoto,
                description: "Insert an image",
                aliases: ["img"],
                action: (editor) => {
                    const url = window.prompt("URL");
                    const caption = window.prompt("caption") || undefined;

                    if (url) {
                        editor
                            .chain()
                            .focus()
                            .setFigure({ src: url, caption })
                            .run();
                    }
                },
            },

            {
                name: "columns",
                label: "Columns",
                icon: IconLayoutColumns,
                description: "Add two column content",
                aliases: ["cols"],
                shouldBeHidden: (editor) => editor.isActive("columns"),
                action: (editor) => {
                    editor
                        .chain()
                        .focus()
                        .setColumns()
                        .focus(editor.state.selection.head - 1)
                        .run();
                },
            },
            {
                name: "horizontalRule",
                label: "Horizontal Rule",
                icon: IconDivide,
                description: "Insert a horizontal divider",
                aliases: ["hr"],
                action: (editor) => {
                    editor.chain().focus().setHorizontalRule().run();
                },
            },
        ],
    },
];

export default GROUPS;
