import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import React, { useCallback, JSX } from "react";

import { isColumnGripSelected } from "./utils";
import { Button, Group } from "@mantine/core";

export const TableColumnMenu = React.memo(
    ({ editor, appendTo }: any): JSX.Element => {
        const shouldShow = useCallback(
            ({ view, state, from }: any) => {
                if (!state) {
                    return false;
                }

                return isColumnGripSelected({
                    editor,
                    view,
                    state,
                    from: from || 0,
                });
            },
            [editor],
        );

        const onAddColumnBefore = useCallback(() => {
            editor.chain().focus().addColumnBefore().run();
        }, [editor]);

        const onAddColumnAfter = useCallback(() => {
            editor.chain().focus().addColumnAfter().run();
        }, [editor]);

        const onDeleteColumn = useCallback(() => {
            editor.chain().focus().deleteColumn().run();
        }, [editor]);

        return (
            <BaseBubbleMenu
                editor={editor}
                pluginKey="tableColumnMenu"
                updateDelay={0}
                tippyOptions={{
                    appendTo: () => {
                        return appendTo?.current;
                    },
                    offset: [0, 15],
                    popperOptions: {
                        modifiers: [{ name: "flip", enabled: false }],
                    },
                }}
                shouldShow={shouldShow}
            >
                <Group>
                    <Button onClick={onAddColumnBefore}>
                        Add column before
                    </Button>
                    <Button onClick={onAddColumnAfter}>Add column after</Button>
                    <Button onClick={onDeleteColumn}>Trash</Button>
                </Group>
            </BaseBubbleMenu>
        );
    },
);

TableColumnMenu.displayName = "TableColumnMenu";

export default TableColumnMenu;
