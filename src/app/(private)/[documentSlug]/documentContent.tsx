"use client";
import { PlateEditor } from "@/components/Editor/editor";
import { editorComponents, viewComponents } from "@/hooks/useEditor/useEditor";
import {
    useGetDocumentSuspenseQuery,
    useUpdateDocumentMutation,
} from "@/services/document";
import { Box, Paper } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { serializeHtml } from "@udecode/plate";
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

    const onUpdate = (content: string) => onUpdateHandler({id, content});
    console.log(content)

    return <PlateEditor content={content} onUpdate={onUpdate} />;
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
