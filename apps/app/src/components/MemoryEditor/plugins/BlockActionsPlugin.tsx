import { useCallback, useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useQuery } from '@tanstack/react-query';
import { Network } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { contextPanelStore } from '@/state/contextPanelStore';
import { useRelationshipsPanelStore } from '@/state/relationshipsPanelStore';
import { claimsByBlockQueryOptions } from '@/query/options/knowledge';

interface BlockPosition {
    key: string;
    top: number;
    height: number;
}

interface BlockActionsPluginProps {
    keyToIdRef: RefObject<Map<string, string>>;
    memoryId?: string;
}

export function BlockActionsPlugin({
    keyToIdRef,
    memoryId,
}: BlockActionsPluginProps) {
    const [editor] = useLexicalComposerContext();
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
        null,
    );
    const [blockPositions, setBlockPositions] = useState<BlockPosition[]>([]);

    // Locate the nearest scrollable + positioned ancestor when the root mounts
    useEffect(() => {
        return editor.registerRootListener((rootElement) => {
            if (!rootElement) {
                setScrollContainer(null);
                return;
            }
            let el: HTMLElement | null = rootElement.parentElement;
            while (el) {
                const style = getComputedStyle(el);
                if (
                    (style.overflowY === 'auto' ||
                        style.overflowY === 'scroll') &&
                    style.position !== 'static'
                ) {
                    setScrollContainer(el);
                    return;
                }
                el = el.parentElement;
            }
        });
    }, [editor]);

    const computePositions = useCallback(() => {
        if (!scrollContainer) return;
        const containerRect = scrollContainer.getBoundingClientRect();
        const positions: BlockPosition[] = [];

        editor.getEditorState().read(() => {
            for (const node of $getRoot().getChildren()) {
                const el = editor.getElementByKey(
                    node.getKey(),
                ) as HTMLElement | null;
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                positions.push({
                    key: node.getKey(),
                    top:
                        rect.top -
                        containerRect.top +
                        scrollContainer.scrollTop,
                    height: rect.height,
                });
            }
        });

        setBlockPositions(positions);
    }, [editor, scrollContainer]);

    // Recompute after every editor update
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            requestAnimationFrame(computePositions);
        });
    }, [editor, computePositions]);

    // Recompute on window resize
    useEffect(() => {
        window.addEventListener('resize', computePositions);
        return () => window.removeEventListener('resize', computePositions);
    }, [computePositions]);

    // Initial compute once the scroll container is known
    useEffect(() => {
        if (scrollContainer) requestAnimationFrame(computePositions);
    }, [scrollContainer, computePositions]);

    if (!scrollContainer) return null;

    return createPortal(
        <>
            {blockPositions.map(({ key, top, height }) => (
                <BlockActionIcon
                    key={key}
                    nodeKey={key}
                    top={top}
                    height={height}
                    blockId={keyToIdRef.current.get(key)}
                    memoryId={memoryId}
                />
            ))}
        </>,
        scrollContainer,
    );
}

// ── Per-block icon: only renders if claims exist for this block ───────────

function BlockActionIcon({
    nodeKey,
    top,
    height,
    blockId,
    memoryId,
}: {
    nodeKey: string;
    top: number;
    height: number;
    blockId?: string;
    memoryId?: string;
}) {
    const openBlockView = useRelationshipsPanelStore((s) => s.openBlockView);

    const { data: claims } = useQuery({
        ...claimsByBlockQueryOptions(blockId ?? ''),
        enabled: !!blockId,
    });

    const hasClaims = claims && claims.length > 0;

    if (!hasClaims) return null;

    const handleClick = () => {
        if (blockId && memoryId) {
            openBlockView(memoryId, blockId);
            contextPanelStore.open('Block Connections');
        }
    };

    return (
        <div
            className="pointer-events-none absolute right-3 flex items-start"
            style={{ top, height }}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="pointer-events-auto size-6 text-primary/60 transition-colors hover:bg-primary/10 hover:text-primary"
                        onClick={handleClick}
                    >
                        <Network className="size-3.5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    {claims.length} connection{claims.length !== 1 ? 's' : ''}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
