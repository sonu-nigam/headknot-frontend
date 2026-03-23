import { useCommitMemory } from "@/hooks/memory/useCommitMemory";
import { useUpdateMemoryBlocks } from "@/hooks/memory/useUpdateMemoryBlocks";
import { type LexicalBlock, type LexicalBlockKind } from "@/lib/lexicalBlockTransformer";
import { extractMemoryIdFromSlug } from "@/lib/memoryUtils";
import { memoryByIdQueryOptions } from "@/query/options/memory";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounceFn, useThrottleFn } from "ahooks";
import { useParams } from "react-router-dom";
import { MemoryHeader } from "./MemoryHeader";
import { useCallback, useRef, useState } from "react";
import { MemoryEditor } from "../MemoryEditor/MemoryEditor";

export function Memory() {
    const params = useParams();
    const memoryId = extractMemoryIdFromSlug(params.memorySlug || null);
    const queryClient = useQueryClient();

    // Counter to force editor remount after checkout/rollback
    const [editorKey, setEditorKey] = useState(0);

    const { data: initialBlocks } = useSuspenseQuery({
        ...memoryByIdQueryOptions(memoryId || ''),
        retry: 0,
        select: (data) =>
            (data.blocks || []).map((block, index) => ({
                id: block.id || crypto.randomUUID(),
                kind: (block.kind ?? 'paragraph') as LexicalBlockKind,
                data: block.data as unknown as LexicalBlock['data'],
                text: (block as unknown as { text?: string }).text || '',
                index: block.index ?? index,
                parentId: block.parentId || null,
            } satisfies LexicalBlock)),
    });

    const updateBlocks = useUpdateMemoryBlocks({ memoryId });

    // Latest blocks waiting to be sent — updated on every editor change
    const pendingBlocksRef = useRef<LexicalBlock[] | null>(null);
    // Prevents concurrent in-flight requests
    const isInFlightRef = useRef(false);

    // Fires the update API: skips if a request is already in flight.
    // When the in-flight request settles, automatically fires again if new
    // blocks arrived while it was running.
    const triggerUpdate = useCallback(() => {
        if (isInFlightRef.current || !pendingBlocksRef.current) return;

        const blocks = pendingBlocksRef.current;
        pendingBlocksRef.current = null;
        isInFlightRef.current = true;

        // Fire-and-forget — onChange does not await this
        updateBlocks.mutateAsync({ blocks })
            .catch((err) => console.error('[Memory] update error:', err))
            .finally(() => {
                isInFlightRef.current = false;
                // Flush any blocks that arrived while the request was in flight
                if (pendingBlocksRef.current) {
                    triggerUpdate();
                }
            });
    }, [updateBlocks]);

    // Throttle the trigger so we don't start a request on every keystroke.
    // After the throttle window elapses, the latest pending blocks are sent.
    const throttledTrigger = useThrottleFn(triggerUpdate, { wait: 2 * 1000 });

    const commitMemory = useCommitMemory({ memoryId });
    // Commit only after the user stops typing (inactivity debounce)
    const debouncedCommit = useDebounceFn(commitMemory.mutateAsync, { wait: 4 * 1000 });

    const onChange = useCallback((blocks: LexicalBlock[]) => {
        console.log('Blocks changed:', blocks);
        pendingBlocksRef.current = blocks;   // always keep the latest
        throttledTrigger.run();              // schedule a non-blocking send
        debouncedCommit.run();               // reset inactivity timer
    }, [throttledTrigger, debouncedCommit]);

    // Called after checkout/rollback to reload editor with fresh blocks
    const handleEditorReload = useCallback(async () => {
        // Cancel any pending updates
        pendingBlocksRef.current = null;
        isInFlightRef.current = false;
        throttledTrigger.cancel();
        debouncedCommit.cancel();
        // Refetch memory data, then remount editor
        await queryClient.invalidateQueries({ queryKey: ['memory', memoryId] });
        setEditorKey((k) => k + 1);
    }, [queryClient, memoryId, throttledTrigger, debouncedCommit]);

    return (
        <>
            <MemoryHeader
                memoryId={memoryId || undefined}
                onEditorReload={handleEditorReload}
            />
            <MemoryEditor
                key={editorKey}
                initialBlocks={initialBlocks}
                onBlocksChange={onChange}
                memoryId={memoryId || undefined}
            />
        </>
    );
}
