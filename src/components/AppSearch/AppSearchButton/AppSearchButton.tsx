"use client";

import { NavLink } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

type Props = {};

function AppSearchButton({}: Props) {
    const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
        event.preventDefault();
    };

    return (
        <>
            <NavLink
                leftSection={<IconSearch size={16} stroke={2} />}
                label="Search"
                py={4}
                component="button"
                onClick={onClick}
            />
        </>
    );
}

export default AppSearchButton;
