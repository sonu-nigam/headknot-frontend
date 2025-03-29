import { useGetDocumentSuspenseQueryOptions } from "@/services/document";
import { Paper } from "@mantine/core";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import DocumentContent from "./documentContent";

export default async function DocumentPage({
    params,
}: {
    params: Promise<{ documentSlug: string }>;
}) {
    const { documentSlug } = await params;

    const id = parseDocumentId(documentSlug);
    if (!id) notFound();

    try {
        const queryClient = new QueryClient();
        await queryClient.fetchQuery(
            useGetDocumentSuspenseQueryOptions({ id }),
        );
    } catch (error) {
        notFound();
    }

    return (
        <Paper p="sm" pt="xl" radius="md" flex={1}>
            <DocumentContent id={id} />
        </Paper>
    );
}

function parseDocumentId(slug: string) {
    const slugParts = slug.split("-");
    const hex = slugParts.at(-1);
    if (!hex) return null;
    const uuid = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
    ].join("-");
    return uuid;
}
