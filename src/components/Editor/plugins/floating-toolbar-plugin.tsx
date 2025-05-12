"use client";

import { createPlatePlugin } from "@udecode/plate/react";

import { FloatingToolbar } from "@/components/Editor/editor-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/Editor/editor-ui/floating-toolbar-buttons";

export const FloatingToolbarPlugin = createPlatePlugin({
    key: "floating-toolbar",
    render: {
        afterEditable: () => (
            <FloatingToolbar>
                <FloatingToolbarButtons />
            </FloatingToolbar>
        ),
    },
});
