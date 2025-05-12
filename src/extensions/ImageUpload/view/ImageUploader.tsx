import { useDropZone, useFileUpload, useUploader } from "./hooks";
import clsx from "clsx";
import { ChangeEvent, useCallback } from "react";
import { IconUpload } from "@tabler/icons-react";
import { Box, Button, Loader, ThemeIcon } from "@mantine/core";
import styles from "./imageUploader.module.css";

export const ImageUploader = ({
    onUpload,
}: {
    onUpload: (url: string) => void;
}) => {
    const { loading, uploadFile } = useUploader({ onUpload });
    const { handleUploadClick, ref } = useFileUpload();
    const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
        uploader: uploadFile,
    });

    const onFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) =>
            e.target.files ? uploadFile(e.target.files[0]) : null,
        [uploadFile],
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
                <Loader />
            </div>
        );
    }

    const wrapperClass = clsx(
        "flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80 border-2 border-dashed",
        draggedInside && "bg-neutral-100",
    );

    return (
        <Box
            onDrop={onDrop}
            onDragOver={onDragEnter}
            onDragLeave={onDragLeave}
            contentEditable={false}
            className={wrapperClass}
        >
            <ThemeIcon
                className="mx-auto"
                variant="light"
                color="dark"
                size="xl"
                mb="md"
            >
                <IconUpload />
            </ThemeIcon>
            <div className="flex items-center justify-center">
                <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
                    {draggedInside ? "Drop image here" : "Drag and drop or"}
                </div>
                &nbsp;
                <Button
                    disabled={draggedInside}
                    onClick={handleUploadClick}
                    variant="transparent"
                    size="compact-sm"
                    px={0}
                >
                    browse image
                </Button>
            </div>
            <input
                className="w-0 h-0 overflow-hidden opacity-0"
                ref={ref}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={onFileChange}
            />
        </Box>
    );
};

export default ImageUploader;
