"use client";

import { ActionIcon, AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { ReactNode } from "react";
import UsersModal from "../UsersModal/UsersModal";
import { IconDots } from "@tabler/icons-react";

type Props = {
    children: ReactNode;
    navbar: ReactNode;
    breadcrumbs: ReactNode;
};

function MainAppShell({ children, navbar, breadcrumbs }: Props) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const shellConfig = {
        header: { height: 60 },
        navbar: {
            width: 300,
            breakpoint: "sm",
            collapsed: {
                mobile: !mobileOpened,
                desktop: !desktopOpened,
            },
        },
    };
    return (
        <AppShell layout="alt" {...shellConfig}>
            <AppShell.Header bd={0}>
                <Group justify="space-between" h="100%" px="md">
                    <Group>
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Burger
                            opened={desktopOpened}
                            onClick={toggleDesktop}
                            visibleFrom="sm"
                            size="sm"
                        />
                        {breadcrumbs}
                    </Group>
                    <Group gap={6}>
                        <UsersModal />
                        <ActionIcon variant="subtle">
                            <IconDots size={16} stroke={2} />
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>{navbar}</AppShell.Navbar>
            <AppShell.Main
                // bg="gray.0"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: 60,
                }}
            >
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

export default MainAppShell;
