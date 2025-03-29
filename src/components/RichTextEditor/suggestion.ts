import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import CommandsList from "./commandList";

export const suggestion = {
    items: ({ query }: any) => {
        return [
            {
                title: "Heading 1",
                command: ({ editor, range }: any) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 1 })
                        .run();
                },
            },
            {
                title: "Heading 2",
                command: ({ editor, range }: any) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 2 })
                        .run();
                },
            },
            {
                title: "Bold",
                command: ({ editor, range }: any) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setMark("bold")
                        .run();
                },
            },
            {
                title: "Italic",
                command: ({ editor, range }: any) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setMark("italic")
                        .run();
                },
            },
        ]
            .filter((item) =>
                item.title.toLowerCase().startsWith(query.toLowerCase()),
            )
            .slice(0, 10);
    },

    render: () => {
        let component: any;
        let popup: any;

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(CommandsList, {
                    // using vue 2:
                    // parent: this,
                    // propsData: props,
                    props,
                    editor: props.editor,
                });
                console.log("Start");

                if (!props.clientRect) {
                    return;
                }

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },

            onUpdate(props: any) {
                component.updateProps(props);
                console.log("Hello");

                if (!props.clientRect) {
                    return;
                }
            },

            onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                    popup[0].hide();

                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                console.log("exit");
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};
