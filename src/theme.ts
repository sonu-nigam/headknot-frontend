"use client";

import { createTheme, MenuItem } from "@mantine/core";

export const theme = createTheme({
    /* Put your mantine theme override here */
    components: {
        MenuItem: MenuItem.extend({
            defaultProps: {
                py: 2,
            },
        }),
    },
});
