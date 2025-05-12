"use client";

import React from "react";

import { cn } from "@udecode/cn";
import {
    type UseVirtualFloatingOptions,
    flip,
    offset,
} from "@udecode/plate-floating";
import {
    type LinkFloatingToolbarState,
    FloatingLinkUrlInput,
    LinkOpenButton,
    useFloatingLinkEdit,
    useFloatingLinkEditState,
    useFloatingLinkInsert,
    useFloatingLinkInsertState,
} from "@udecode/plate-link/react";
import { useFormInputProps } from "@udecode/plate/react";
import { ExternalLink, Link, Text, Unlink } from "lucide-react";
import { Button, Divider, InputBase } from "@mantine/core";
import { IconExternalLink, IconLink, IconUnlink } from "@tabler/icons-react";

const floatingOptions: UseVirtualFloatingOptions = {
    middleware: [
        offset(12),
        flip({
            fallbackPlacements: ["bottom-end", "top-start", "top-end"],
            padding: 12,
        }),
    ],
    placement: "bottom-start",
};

export interface LinkFloatingToolbarProps {
    state?: LinkFloatingToolbarState;
}

export function LinkFloatingToolbar({ state }: LinkFloatingToolbarProps) {
    const insertState = useFloatingLinkInsertState({
        ...state,
        floatingOptions: {
            ...floatingOptions,
            ...state?.floatingOptions,
        },
    });
    const {
        hidden,
        props: insertProps,
        ref: insertRef,
        textInputProps,
    } = useFloatingLinkInsert(insertState);

    const editState = useFloatingLinkEditState({
        ...state,
        floatingOptions: {
            ...floatingOptions,
            ...state?.floatingOptions,
        },
    });
    const {
        editButtonProps,
        props: editProps,
        ref: editRef,
        unlinkButtonProps,
    } = useFloatingLinkEdit(editState);
    const inputProps = useFormInputProps({
        preventDefaultOnEnterKeydown: true,
    });

    if (hidden) return null;

    const input = (
        <InputBase
            leftSection={<IconLink size={16} />}
            component={FloatingLinkUrlInput}
            placeholder="Paste link"
            data-plate-focus
            size="xs"
            {...inputProps}
        />
    );

    const editContent = editState.isEditing ? (
        input
    ) : (
        <Button.Group __size="sm">
            <Button
                size="xs"
                px={6.25}
                variant="default"
                {...unlinkButtonProps}
            >
                <IconUnlink size={16} />
            </Button>
            <Button size="xs" variant="default" {...editButtonProps}>
                Edit link
            </Button>
            <Button
                size="xs"
                px={6.25}
                variant="default"
                component={LinkOpenButton}
            >
                <IconExternalLink size={16} />
            </Button>
        </Button.Group>
    );

    return (
        <>
            <div ref={insertRef} className={cn("w-auto p-1")} {...insertProps}>
                {input}
            </div>

            <div ref={editRef} className={cn("w-auto p-1")} {...editProps}>
                {editContent}
            </div>
        </>
    );
}
