"use client";

import React, { ReactNode, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import FileTree from "../FileTree/fileTree";
import { useGetDocumentTreeSuspenseQueryOptions } from "@/services/document";

export type Props = {
    fileMenu?: ({ children, id }: { children: any; id: string }) => ReactNode;
};

function DocumentNav({ fileMenu }: Props) {
    const { data } = useSuspenseQuery(useGetDocumentTreeSuspenseQueryOptions());

    return <FileTree data={data} fileMenu={fileMenu} />;
}

export default DocumentNav;
