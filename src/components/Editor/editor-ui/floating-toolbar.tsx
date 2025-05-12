"use client";
import React from "react";
import { cn, withRef } from "@udecode/cn";
import {
    type FloatingToolbarState,
    flip,
    offset,
    useFloatingToolbar,
    useFloatingToolbarState,
} from "@udecode/plate-floating";
import {
    useComposedRef,
    useEditorId,
    useEventEditorValue,
    usePluginOption,
} from "@udecode/plate/react";
import { Box } from "@mantine/core";
export const FloatingToolbar = withRef<
    any,
    {
        state?: FloatingToolbarState;
    }
>(({ children, state, ...props }, componentRef) => {
    const editorId = useEditorId();
    const focusedEditorId = useEventEditorValue("focus");
    const isFloatingLinkOpen = !!usePluginOption({ key: "a" }, "mode");
    const isAIChatOpen = usePluginOption({ key: "aiChat" }, "open");
    const floatingToolbarState = useFloatingToolbarState({
        editorId,
        focusedEditorId,
        hideToolbar: isFloatingLinkOpen || isAIChatOpen,
        ...state,
        floatingOptions: {
            middleware: [
                offset(12),
                flip({
                    fallbackPlacements: [
                        "top-start",
                        "top-end",
                        "bottom-start",
                        "bottom-end",
                    ],
                    padding: 12,
                }),
            ],
            placement: "top",
            ...state?.floatingOptions,
        },
    });
    const {
        clickOutsideRef,
        hidden,
        props: rootProps,
        ref: floatingRef,
    } = useFloatingToolbar(floatingToolbarState);
    const ref = useComposedRef<HTMLDivElement>(componentRef, floatingRef);
    if (hidden) return null;
    return (
        <div ref={clickOutsideRef}>
            <Box
                ref={ref}
                bg="var(--mantine-color-body)"
                p="calc(0.25rem* var(--mantine-scale))"
                className="border rounded-md border-[var(--mantine-color-default-border)]"
                display="flex"
                {...rootProps}
                {...props}
            >
                {children}
            </Box>
        </div>
    );
});
