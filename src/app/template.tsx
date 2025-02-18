"use client";

import React from "react";
import { Anchor, AppShell, Breadcrumbs, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AppNavbar from "@/components/AppNavbar/AppNavbar";
import { IconHome } from "@tabler/icons-react";

function HomeTemplate({ children }: { children: React.ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
            layout="alt"
        >
            <AppShell.Header bd={0}>
                <Group h="100%" px="md">
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
                    <Breadcrumbs>
                        <Anchor href="/">
                            <IconHome size={16} />
                        </Anchor>
                    </Breadcrumbs>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <AppNavbar />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}

export default HomeTemplate;
