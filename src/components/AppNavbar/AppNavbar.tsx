import {
    Avatar,
    Card,
    Text,
    Group,
    ActionIcon,
    NavLink,
    Space,
    Divider,
} from "@mantine/core";
import {
    IconBriefcase,
    IconDots,
    IconFile,
    IconFilePlus,
    IconFolderPlus,
    IconHome,
    IconInbox,
    IconSearch,
    IconSelector,
} from "@tabler/icons-react";

export default function AppNavbar() {
    return (
        <>
            <Card padding={0} mb="xs" w="100%">
                <Group justify="start">
                    <Avatar color="indigo" radius="xs">
                        MK
                    </Avatar>
                    <Space flex={1}>
                        <Text size="sm" fw={500}>
                            John Doe
                        </Text>
                        <Text size="sm" fw={500} opacity={0.5}>
                            johndoe@gmail.com
                        </Text>
                    </Space>
                    <ActionIcon variant="subtle" color="gray">
                        <IconSelector size={24} />
                    </ActionIcon>
                </Group>
            </Card>
            <div className="py-2 overflow-y-auto">
                <NavLink
                    leftSection={<IconHome size={16} stroke={2} />}
                    label="Home"
                    href="#required-for-focus"
                    py={4}
                />
                <NavLink
                    leftSection={<IconSearch size={16} stroke={2} />}
                    label="Search"
                    href="#required-for-focus"
                    py={4}
                />
                <NavLink
                    leftSection={<IconFilePlus size={16} stroke={2} />}
                    label="New Doc"
                    href="#required-for-focus"
                    py={4}
                />
                <NavLink
                    leftSection={<IconInbox size={16} stroke={2} />}
                    label="Inbox"
                    href="#required-for-focus"
                    py={4}
                />
                <Group gap={6} opacity={0.5} mb="xs" mt="lg">
                    <Text tt="capitalize" fw={500} size="sm" flex={1}>
                        Documents
                    </Text>
                    <ActionIcon size="sm" variant="light">
                        <IconFolderPlus size={16} />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="light">
                        <IconFilePlus size={16} />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="light">
                        <IconDots size={16} />
                    </ActionIcon>
                </Group>
                <NavLink
                    label="First parent link"
                    leftSection={<IconFile size={16} stroke={1.5} />}
                    childrenOffset={28}
                    py={4}
                >
                    <NavLink
                        href="#required-for-focus"
                        label="First child link"
                        py={4}
                    />
                    <NavLink
                        label="Second child link"
                        href="#required-for-focus"
                        py={4}
                    />
                    <NavLink
                        label="Nested parent link"
                        childrenOffset={28}
                        href="#required-for-focus"
                        py={4}
                    >
                        <NavLink
                            label="First child link"
                            href="#required-for-focus"
                            py={4}
                        />
                        <NavLink
                            label="Second child link"
                            href="#required-for-focus"
                            py={4}
                        />
                        <NavLink
                            label="Third child link"
                            href="#required-for-focus"
                            py={4}
                        />
                    </NavLink>
                </NavLink>
            </div>
            <div className="mt-auto">
                <NavLink
                    leftSection={<IconInbox size={16} stroke={2} />}
                    label="Invite"
                    href="#required-for-focus"
                    py={4}
                />
            </div>
        </>
    );
}
