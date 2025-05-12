import { getDocumentSuspenseQueryOptions } from "@/services/document";
import {
    Box,
    Paper,
    Container,
    BackgroundImage,
    Group,
    Button,
} from "@mantine/core";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import DocumentContent from "./documentContent";
import EditorTitle from "./editorTitle";

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
        const queryOptions = getDocumentSuspenseQueryOptions({ id })
        await queryClient.fetchQuery(queryOptions);
    } catch (error) {
        notFound();
    }

    return (
        <>
            <BackgroundImage
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
                radius="sm"
                h={400}
            />
            <Paper>
                <Container>
                    <Paper w="100%">
                        <DocumentContent id={id} />
                    </Paper>
                </Container>
            </Paper>
        </>
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
