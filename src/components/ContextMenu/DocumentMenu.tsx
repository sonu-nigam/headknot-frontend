"use client";
import React, { ReactNode } from "react";
import {
    Menu,
    MenuDivider,
    MenuDropdown,
    MenuItem,
    MenuTarget,
    Text,
} from "@mantine/core";
import {
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconSettings,
    IconTrash,
} from "@tabler/icons-react";
import { useDeleteDocumentMutation } from "@/services/document";

export function DocumentMenu({
    children,
    id,
}: {
    children: ReactNode;
    id: string;
}) {
    const deleteDocumentMutation = useDeleteDocumentMutation();

    const onClickDeleteDocument = () => {
        deleteDocumentMutation.mutate({ id });
    };

    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-start"
            onChange={console.log}
        >
            <MenuTarget>{children}</MenuTarget>

            <MenuDropdown>
                <MenuItem leftSection={<IconSettings size={14} />}>
                    Mark Favorite
                </MenuItem>
                <MenuItem leftSection={<IconMessageCircle size={14} />}>
                    Copy Link
                </MenuItem>
                <MenuItem leftSection={<IconPhoto size={14} />}>
                    Rename
                </MenuItem>
                <MenuItem
                    leftSection={<IconSearch size={14} />}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            ⌘K
                        </Text>
                    }
                >
                    Move to
                </MenuItem>
                <MenuItem leftSection={<IconPhoto size={14} />}>Share</MenuItem>

                <MenuDivider />

                <MenuItem
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={onClickDeleteDocument}
                >
                    Move to bin
                </MenuItem>
            </MenuDropdown>
        </Menu>
    );
}

export default DocumentMenu;
