"use client";
import { useGetUserSuspenseQuery } from "@/services/users";
import {
    ActionIcon,
    Avatar,
    Box,
    Card,
    Group,
    Progress,
    Space,
    Text,
    Menu,
    Button,
    Flex,
} from "@mantine/core";
import {
    IconChevronDown,
    IconHelp,
    IconPlug,
    IconSettings,
    IconBook,
    IconLogout,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import React, { ReactNode, useState } from "react";

type Props = {};

function getInitials(name: string) {
    console.log(name);
    const nameParts: Array<string> = name.split(" ");
    return nameParts[0][0] + nameParts?.at(-1)?.[0];
}

function UserCard({}: Props) {
    const session = useSession();

    const { data } = useGetUserSuspenseQuery({
        userId: session.data?.user?.id as string,
    });

    console.log(data);
    const initials = getInitials(data.fullName);

    return (
        <Card w="100%" p="sm" bg="transparent">
            <Group mb={16}>
                <Progress value={40} size="xs" flex={1} />
                <Text size="xs">40%</Text>
            </Group>
            <UserMenu actionIcon={<IconChevronDown size={24} stroke={2} />}>
                <Flex gap="sm" align="center">
                    <Avatar color="indigo" size={32}>
                        {initials}
                    </Avatar>
                    <Space flex={1}>
                        <Text size="sm" fw={500}>
                            {data.fullName}
                        </Text>
                        <Text size="sm" fw={500} opacity={0.5}>
                            {data.email}
                        </Text>
                    </Space>
                </Flex>
            </UserMenu>
        </Card>
    );
}
export default UserCard;

function UserMenu({
    children,
    actionIcon,
}: {
    children: ReactNode;
    actionIcon: ReactNode;
}) {
    const [opened, setOpened] = useState(false);

    return (
        <Menu
            shadow="md"
            width="target"
            offset={-40}
            onChange={setOpened}
            opened={opened}
        >
            <Menu.Target>
                <Group>
                    {children}
                    <ActionIcon
                        ml="auto"
                        size="sm"
                        variant="subtle"
                        color="dark"
                    >
                        {actionIcon}
                    </ActionIcon>
                </Group>
            </Menu.Target>
            <Menu.Dropdown style={{ borderRadius: 10 }}>
                <Box px={10} py={5}>
                    <Group>
                        {children}
                        <ActionIcon
                            ml="auto"
                            size="sm"
                            variant="subtle"
                            color="dark"
                            onClick={() => setOpened(false)}
                        >
                            {actionIcon}
                        </ActionIcon>
                    </Group>
                    <Text size="sm" mt="lg">
                        You have used 40% of your available storage on Premium
                        Plan
                    </Text>
                    <Group mt={16}>
                        <Progress value={40} size="xs" flex={1} />
                        <Text size="xs">40%</Text>
                    </Group>
                    <Button size="xs" mt="md" variant="light">
                        View Storage
                    </Button>
                </Box>
                <Menu.Divider mt="sm" />
                <Menu.Label>Account</Menu.Label>
                <Menu.Item py={4} leftSection={<IconSettings size={14} />}>
                    Account Settings
                </Menu.Item>
                <Menu.Item py={4} leftSection={<IconBook size={14} />}>
                    Guide
                </Menu.Item>
                <Menu.Item py={4} leftSection={<IconHelp size={14} />}>
                    Help & Support
                </Menu.Item>
                <Menu.Item py={4} leftSection={<IconPlug size={14} />}>
                    Integration
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    onClick={() =>
                        signOut({
                            redirectTo: "/auth/signin",
                        })
                    }
                    color="red"
                    py={4}
                    leftSection={<IconLogout size={14} />}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
