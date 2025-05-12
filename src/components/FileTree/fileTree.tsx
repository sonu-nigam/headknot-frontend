import React, { ReactNode } from "react";
import FileItem, { File } from "./FileItem/fileItem";

export type Props = {
    data: File[];
    fileMenu?: ({ children, id }: { children: any; id: string }) => ReactNode;
};

function FileTree({ data, fileMenu }: Props) {
    return data.map((file: File) => (
        <FileItem file={file} key={file.id} fileMenu={fileMenu}>
            {Array.isArray(file.children) && file.children.length && (
                <FileTree data={file.children} fileMenu={fileMenu} />
            )}
        </FileItem>
    ));
}

export default FileTree;
