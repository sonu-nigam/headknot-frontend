import React, { Suspense } from "react";
import { Anchor, Box, Breadcrumbs, Paper } from "@mantine/core";
import AppNavbar from "@/components/AppNavbar/AppNavbar";
import { IconHome } from "@tabler/icons-react";
import MainAppShell from "@/components/MainAppShell/MainAppShell";

function HomeTemplate({ children }: { children: React.ReactNode }) {
    return (
        <>
            <MainAppShell
                breadcrumbs={
                    <Breadcrumbs>
                        <Anchor href="/">
                            <IconHome size={16} />
                        </Anchor>
                    </Breadcrumbs>
                }
                navbar={<AppNavbar />}
            >
                {children}
            </MainAppShell>
        </>
    );
}

export default HomeTemplate;
