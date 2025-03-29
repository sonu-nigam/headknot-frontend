"use client";
import React from "react";
import "@mantine/spotlight/styles.css";
import { Spotlight, SpotlightActionData } from "@mantine/spotlight";
import {
    IconDashboard,
    IconFileText,
    IconHome,
    IconSearch,
} from "@tabler/icons-react";

type Props = {};

function SearchBox({}: Props) {
    return (
        <Spotlight
            actions={actions}
            nothingFound="Nothing found..."
            highlightQuery
            searchProps={{
                leftSection: <IconSearch size={20} stroke={1.5} />,
                placeholder: "Search...",
            }}
        />
    );
}

export default SearchBox;

const actions: SpotlightActionData[] = [
    {
        id: "home",
        label: "Home",
        description: "Get to home page",
        onClick: () => console.log("Home"),
        leftSection: <IconHome size={24} stroke={1.5} />,
    },
    {
        id: "dashboard",
        label: "Dashboard",
        description: "Get full information about current system status",
        onClick: () => console.log("Dashboard"),
        leftSection: <IconDashboard size={24} stroke={1.5} />,
    },
    {
        id: "documentation",
        label: "Documentation",
        description: "Visit documentation to lean more about all features",
        onClick: () => console.log("Documentation"),
        leftSection: <IconFileText size={24} stroke={1.5} />,
    },
];
