// src/plugins/custom-slash-plugin.ts

import { createPlatePlugin } from "@udecode/plate/react";

export const CUSTOM_SLASH_KEY = 'custom-slash';

export const createCustomSlashPlugin = createPlatePlugin({
    key: CUSTOM_SLASH_KEY,
    options: {
        trigger: '/',
        triggerPreviousCharPattern: /^\s?$/,
    },
    handlers: {
        onKeyDown: ({ editor }) => {
            console.info('Editor value:', editor.children);
            // Handle slash key logic here
        },
    },
});
