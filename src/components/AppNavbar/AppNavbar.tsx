import {
    Avatar,
    Card,
    Text,
    Group,
    ActionIcon,
    Space,
    Progress,
    Box,
    ThemeIcon,
} from "@mantine/core";
import {
    IconChevronDown,
    IconDots,
    IconFile,
    IconHome,
    IconInbox,
    IconSelector,
} from "@tabler/icons-react";
import { DocumentMenu } from "@/components/ContextMenu/ContextMenu";
import { NavLink } from "../CustomNavLink/NavLink";
import Link from "next/link";
import React, { Suspense } from "react";
import AppSearchButton from "../AppSearch/AppSearchButton/AppSearchButton";
import DocumentNavServerComponent from "../DocumentNav/documentNav.server";
import AddDocumentButton from "../AddDocument/AddDocumentButton";
import UsersModal from "../UsersModal/UsersModal";
import UserCard from "./UserCard/userCard";

export default function AppNavbar() {
    return (
        <>
            <div className="p-2 overflow-y-auto h-full flex flex-col">
                <NavLink
                    leftSection={<IconHome size={16} stroke={2} />}
                    label="Home"
                    href="/home"
                    py={4}
                    component={Link}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            ⌘K
                        </Text>
                    }
                />
                <AppSearchButton />
                <Group
                    gap={6}
                    mt="lg"
                    px={8}
                    py={2}
                    c="dimmed"
                    bg="gray.1"
                    style={{
                        borderRadius: 6,
                    }}
                >
                    <ThemeIcon variant="transparent" color="gray">
                        <IconFile size={16} stroke={2} />
                    </ThemeIcon>
                    <Text tt="uppercase" fw={500} size="sm" flex={1}>
                        Personal
                    </Text>
                    <AddDocumentButton />
                    <ActionIcon size="sm" variant="transparent">
                        <IconDots size={16} />
                    </ActionIcon>
                </Group>
                <Box pl="sm">
                    <Suspense fallback={<h3>Loading</h3>}>
                        <DocumentNavServerComponent fileMenu={DocumentMenu} />
                    </Suspense>
                </Box>
            </div>
            <div className="mt-auto">
                <UserCard />
            </div>
        </>
    );
}
