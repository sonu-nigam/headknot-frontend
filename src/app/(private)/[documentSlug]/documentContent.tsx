"use client";
import Editor from "@/components/RichTextEditor/richTextEditor";
import {
    useGetDocumentSuspenseQuery,
    useUpdateDocumentMutation,
} from "@/services/document";
import { Box, Paper } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import React from "react";

type Props = {
    id: string;
};

function DocumentContent({ id }: Props) {
    const { data } = useGetDocumentSuspenseQuery({ id });
    const content = data.description;
    const updateDocument = useUpdateDocumentMutation();
    const onUpdateHandler = useDebouncedCallback(({ id, content }) => {
        const title = extractTitle(content);
        const description = content;
        updateDocument.mutate({
            id,
            title,
            description,
        });
    }, 1000);

    const onUpdate = ({ editor }: any) => {
        onUpdateHandler({
            id,
            content: editor.getHTML(),
        });
    };

    return (
        <Box maw={680} mx="auto">
            <Editor content={content} onUpdate={onUpdate} />
        </Box>
    );
}

export default DocumentContent;

const extractTitle = (content: string) => {
    const template = document.createElement("template");
    template.innerHTML = content;
    const heading = template.content.querySelector("h1");
    if (!heading) return null;

    if (!heading.textContent) return null;

    return heading.textContent.trim();
};
