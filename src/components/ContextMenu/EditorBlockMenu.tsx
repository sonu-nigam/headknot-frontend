"use client";
import React, { ReactNode } from "react";
import {
    Box,
    Menu,
    MenuDivider,
    MenuDropdown,
    MenuItem,
    MenuTarget,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconSettings,
} from "@tabler/icons-react";

export function EditorBlockMenu({ children }: { children: ReactNode }) {
    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-start"
            onChange={console.log}
        >
            <MenuTarget>{children}</MenuTarget>

            <MenuDropdown>
                <Box p={4} mb={4}>
                    <TextInput size="xs" />
                </Box>
                <MenuItem leftSection={<IconSettings size={14} />}>
                    Comment
                </MenuItem>
                <MenuItem leftSection={<IconPhoto size={14} />}>
                    Duplicate
                </MenuItem>
                <MenuItem
                    leftSection={<IconSearch size={14} />}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            ⌘K
                        </Text>
                    }
                >
                    Turn into
                </MenuItem>
                <MenuItem leftSection={<IconPhoto size={14} />}>Color</MenuItem>
                <MenuItem leftSection={<IconPhoto size={14} />}>
                    List icon
                </MenuItem>
                <MenuItem leftSection={<IconMessageCircle size={14} />}>
                    Delete
                </MenuItem>
            </MenuDropdown>
        </Menu>
    );
}

export default EditorBlockMenu;
