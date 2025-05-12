import { ActionIcon, Group, ThemeIcon } from "@mantine/core";
import {
    IconArtboard,
    IconDots,
    IconFile,
    IconFilePlus,
} from "@tabler/icons-react";
import React, { ReactNode } from "react";
import styles from "./fileItem.module.css";
import { NavLink } from "@/components/CustomNavLink/NavLink";
import Link from "next/link";
import { useAddDocumentMutation } from "@/services/document";

export type FileType = string;
export type File = {
    id: string;
    title: string;
    type: FileType;
    children: File[] | [] | null;
};

type Props = {
    file: File;
    fileMenu?: ({ children, id }: { children: any; id: string }) => ReactNode;
    children: ReactNode;
};

function fileIcon(type: FileType) {
    if (type === "CANVAS") {
        return IconArtboard;
    }
    return IconFile;
}

function FileItem({ file, fileMenu, children }: Props) {
    const FileIcon = fileIcon(file.type);
    const CtxMenu = fileMenu;
    const addDocumentMutation = useAddDocumentMutation();

    const preventAnchorLinkClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
    };

    const onClickAddDocument = () => {
        addDocumentMutation.mutate({
            parent: file.id,
            title: "New Page",
        });
    };

    return (
        <NavLink
            component={Link}
            href={"/" + file.id.replace(/-/g, "")}
            label={
                <Group gap={6}>
                    <ThemeIcon size="sm" variant="subtle">
                        <FileIcon size={16} />
                    </ThemeIcon>
                    <span>{file.title}</span>
                </Group>
            }
            className={styles.file_item}
            rightSection={
                <Group gap={6} onClick={preventAnchorLinkClick}>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={onClickAddDocument}
                    >
                        <IconFilePlus size={16} />
                    </ActionIcon>
                    {CtxMenu && (
                        <CtxMenu id={file.id}>
                            <ActionIcon size="sm" variant="subtle">
                                <IconDots size={16} />
                            </ActionIcon>
                        </CtxMenu>
                    )}
                </Group>
            }
            childrenOffset={28}
            py={4}
            onClickExpand={preventAnchorLinkClick}
        >
            {children}
        </NavLink>
    );
}

export default FileItem;
