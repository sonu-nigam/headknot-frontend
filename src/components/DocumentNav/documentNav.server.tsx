import React, { ReactNode } from "react";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { useGetDocumentTreeSuspenseQueryOptions } from "@/services/document";
import DocumentNav, { Props } from "./documentNav";

async function DocumentNavServerComponent({ fileMenu }: Props) {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(useGetDocumentTreeSuspenseQueryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DocumentNav fileMenu={fileMenu} />
        </HydrationBoundary>
    );
}

export default DocumentNavServerComponent;
