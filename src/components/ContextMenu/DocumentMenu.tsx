import React from "react";
import {
    Menu,
    MenuDivider,
    MenuDropdown,
    MenuItem,
    MenuLabel,
    MenuTarget,
    Text,
} from "@mantine/core";
import {
    IconArrowsLeftRight,
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconSettings,
    IconTrash,
} from "@tabler/icons-react";

function DocumentMenu({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Menu shadow="md" width={200} position="bottom-start">
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

                <MenuItem color="red" leftSection={<IconTrash size={14} />}>
                    Move to bin
                </MenuItem>
            </MenuDropdown>
        </Menu>
    );
}

export default DocumentMenu;
