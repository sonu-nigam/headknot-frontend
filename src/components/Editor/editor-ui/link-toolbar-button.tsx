"use client";

import React from "react";

import { withRef } from "@udecode/cn";
import {
    useLinkToolbarButton,
    useLinkToolbarButtonState,
} from "@udecode/plate-link/react";
import { ActionIcon } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";

export const LinkToolbarButton = withRef<typeof ActionIcon>((rest, ref) => {
    const state = useLinkToolbarButtonState();
    const {
        props: { pressed, ...restProps },
    } = useLinkToolbarButton(state);

    return (
        <ActionIcon
            ref={ref}
            data-plate-focus
            variant={pressed ? "light" : "subtle"}
            {...restProps}
            {...rest}
        >
            <IconLink size={16} stroke={2} />
        </ActionIcon>
    );
});
