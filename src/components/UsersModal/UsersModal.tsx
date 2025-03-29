"use client";
import {
    ActionIcon,
    Autocomplete,
    Avatar,
    Group,
    Modal,
    Select,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconChevronRight,
    IconSearch,
    IconUserPlus,
} from "@tabler/icons-react";
import React from "react";

type Props = {};

function UsersModal({}: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Members">
                <Autocomplete
                    placeholder="Add Team Member"
                    data={[]}
                    leftSection={<IconSearch size={16} stroke={2} />}
                />
                <Text size="sm" fw={700} mt={10}>
                    People with Access
                </Text>
                <div
                    style={{
                        margin: "var(--mantine-spacing-sm) 0",
                        color: "var(--mantine-color-text)",
                        borderRadius: "var(--mantine-radius-sm)",
                    }}
                >
                    <Group>
                        <Avatar src={null} alt="no image here" color="indigo" />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>
                                Frankie Sullivan
                            </Text>
                            <Text c="dimmed" size="xs">
                                frankie@untitledui.com
                            </Text>
                        </div>
                        <Select
                            variant="filled"
                            size="xs"
                            placeholder="Pick value"
                            data={[
                                { value: "FULL_ACCESS", label: "Full Access" },
                                { value: "EDIT", label: "Edit" },
                                { value: "COMMENT", label: "Comment" },
                                { value: "READ", label: "Read" },
                            ]}
                        />
                    </Group>
                </div>
                <Text size="sm" fw={700}>
                    General Access
                </Text>
            </Modal>
            <ActionIcon variant="subtle" onClick={open}>
                <IconUserPlus size={16} stroke={2} />
            </ActionIcon>
        </>
    );
}

export default UsersModal;
