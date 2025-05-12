"use client";

import { insertInlineEquation } from "@udecode/plate-math";
import { useEditorRef, withRef } from "@udecode/plate/react";
import { RadicalIcon } from "lucide-react";

import { Button } from "@mantine/core";

export const InlineEquationToolbarButton = withRef<typeof Button>(
    (props, ref) => {
        const editor = useEditorRef();

        return (
            <Button
                ref={ref}
                {...props}
                onClick={() => {
                    insertInlineEquation(editor);
                }}
            >
                <RadicalIcon />
            </Button>
        );
    },
);
