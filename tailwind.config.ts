import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/extensions/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            typography: {
                DEFAULT: {
                    css: {
                        'ul[data-type="taskList"] li': {
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                            justifyContent: "flex-start",
                        },
                        'ul[data-type="taskList"] li>label': {
                            flex: "0 0 auto",
                            marginRight: ".5rem",
                            userSelect: "none",
                        },
                        "ul[data-type=taskList] li>div": {
                            flex: "1 1 auto",
                        },
                        "div[data-type=columns]": {
                            display: "grid",
                            gridAutoFlow: "column",
                            gap: 10,
                        },
                        "div[data-type=columns].has-focus": {
                            border: "1px dashed gray",
                        },
                    },
                },
            },
        },
    },
    plugins: [Typography],
} satisfies Config;
