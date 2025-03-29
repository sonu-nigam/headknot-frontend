"use client";
import { useAddDocumentMutation } from "@/services/document";
import { ActionIcon } from "@mantine/core";
import { IconFilePlus } from "@tabler/icons-react";
import React from "react";

type Props = {};

function AddDocumentButton({}: Props) {
    const addDocumentMutation = useAddDocumentMutation();

    const onClickAddDocument = () => {
        addDocumentMutation.mutate({ parent: null });
    };

    return (
        <ActionIcon
            size="sm"
            variant="transparent"
            onClick={onClickAddDocument}
        >
            <IconFilePlus size={16} />
        </ActionIcon>
    );
}

export default AddDocumentButton;
