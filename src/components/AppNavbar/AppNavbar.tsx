import {
    Button,
    Avatar,
    Card,
    CardSection,
    Text,
    Image,
    Group,
    ActionIcon,
    NavLink,
    Space,
    Divider,
    ThemeIcon,
} from "@mantine/core";
import {
    IconBluetoothConnected,
    IconBox,
    IconBriefcase,
    IconDots,
    IconDotsVertical,
    IconFilePlus,
    IconGauge,
    IconInbox,
    IconMailbox,
    IconPlus,
    IconSearch,
    IconSelect,
    IconSelector,
    IconUsers,
    IconUserShare,
} from "@tabler/icons-react";

export default function AppNavbar() {
    return (
        <div className="kdjdk">
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
            <Divider my="sm" />
            <Group gap={6} opacity={0.5} mb="xs">
                <IconBriefcase size={16} />
                <Text tt="uppercase" fw={500} size="sm" flex={1}>
                    Private
                </Text>
                <ActionIcon size="sm" variant="light">
                    <IconDots size={16} />
                </ActionIcon>
            </Group>
            <NavLink
                label="First parent link"
                leftSection={<IconGauge size={16} stroke={1.5} />}
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
            <Divider my="sm" />
            <Group gap={6} opacity={0.5} mb="xs">
                <IconUsers size={16} />
                <Text tt="uppercase" fw={500} size="sm" flex={1}>
                    Public
                </Text>
                <ActionIcon size="sm" variant="light">
                    <IconPlus size={16} />
                </ActionIcon>
                <ActionIcon size="sm" variant="light">
                    <IconDots size={16} />
                </ActionIcon>
            </Group>
            <NavLink
                label="First parent link"
                leftSection={<IconGauge size={16} stroke={1.5} />}
                childrenOffset={28}
                py={4}
            />
            <Divider my="sm" />
            <Group gap={6} opacity={0.5} mb="xs">
                <IconUserShare size={16} />
                <Text tt="uppercase" fw={500} size="sm" flex={1}>
                    Shared
                </Text>
                <ActionIcon size="sm" variant="light">
                    <IconPlus size={16} />
                </ActionIcon>
                <ActionIcon size="sm" variant="light">
                    <IconDots size={16} />
                </ActionIcon>
            </Group>
            <NavLink
                label="First parent link"
                leftSection={<IconGauge size={16} stroke={1.5} />}
                childrenOffset={28}
                py={4}
            />
            <Divider my="sm" />
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
        </div>
    );
}
