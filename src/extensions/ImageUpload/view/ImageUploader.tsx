import { useDropZone, useFileUpload, useUploader } from "./hooks";
import clsx from "clsx";
import { ChangeEvent, useCallback } from "react";
import { IconImageInPicture, IconUpload } from "@tabler/icons-react";
import { Button, Loader, ThemeIcon } from "@mantine/core";

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
        "flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80",
        draggedInside && "bg-neutral-100",
    );

    return (
        <div
            className={wrapperClass}
            onDrop={onDrop}
            onDragOver={onDragEnter}
            onDragLeave={onDragLeave}
            contentEditable={false}
        >
            <ThemeIcon>
                <IconImageInPicture />
            </ThemeIcon>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
                    {draggedInside ? "Drop image here" : "Drag and drop or"}
                </div>
                <div>
                    <Button
                        disabled={draggedInside}
                        onClick={handleUploadClick}
                        variant="primary"
                        size="sm"
                        leftSection={<IconUpload />}
                    >
                        Upload an image
                    </Button>
                </div>
            </div>
            <input
                className="w-0 h-0 overflow-hidden opacity-0"
                ref={ref}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={onFileChange}
            />
        </div>
    );
};

export default ImageUploader;
