import { MainEditor } from "@/forms/editor/MainEditor";
import { useCommitMemory } from "@/hooks/memory/useCommitMemory";
import { useUpdateMemoryBlocks } from "@/hooks/memory/useUpdateMemoryBlocks";
import { Block } from "@/lib/editorValueTransformer";
import { extractMemoryIdFromSlug } from "@/lib/memoryUtils";
import { memoryByIdQueryOptions } from "@/query/options/memory";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useDebounceFn, useThrottleFn } from "ahooks";
import { useParams } from "react-router-dom";
import { Separator } from "@workspace/ui/components/separator";
import { MemoryHeader } from "./MemoryHeader";
import { useCallback } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";

export function Memory() {
    const params = useParams();
    const memoryId = extractMemoryIdFromSlug(params.memorySlug || null);

    const { data: initialBlocks } = useSuspenseQuery({
        ...memoryByIdQueryOptions(memoryId || ''),
        retry: 0,
        select: (data) =>
            (data.blocks || []).map((block) => ({
                ...block,
                id: block.id || 'placeholder-id', // Ensure `id` is a string
                kind: block.kind as Block['kind'],
                data: Array.isArray(block.data) ? block.data : [],
                text: '',
                index: block.index as number,
                parentId: block.parentId || null,
            })),
    });

    const updateBlocks = useUpdateMemoryBlocks({
        memoryId,
        onSuccess: () => {
            console.info('Memory updated successfully');
        },
        onError: (error) => {
            console.error(error.message);
        },
    });
    const throttleUpdateBlocks = useThrottleFn(updateBlocks.mutateAsync, {
        wait: 2 * 1000,
    });

    const commitMemory = useCommitMemory({ memoryId });
    const debouncedCommitMemory = useDebounceFn(commitMemory.mutateAsync, {
        wait: 1 * 4 * 1000,
    });

    const onChange = useCallback(async (blocks: Block[]) => {
        throttleUpdateBlocks.run({ blocks });  // Schedule latest
        debouncedCommitMemory.run();
    }, [throttleUpdateBlocks, debouncedCommitMemory]);

    // useEffect(() => {
    //     const saveOnClose = () => {
    //         if (document.visibilityState === 'hidden') {
    //             commitMemory.mutateAsync();
    //         }
    //     };

    //     document.addEventListener('visibilitychange', saveOnClose);
    //     return () =>
    //         document.removeEventListener('visibilitychange', saveOnClose);
    // }, [memoryId]);

    return (
        <>
            <MemoryHeader />
            <Separator className="mb-6" />
            <MainEditor initialValue={initialBlocks} onChange={onChange} />
        </>
    );
}
