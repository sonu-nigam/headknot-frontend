import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Network } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';

interface BlockPosition {
    key: string;
    top: number;
    height: number;
}

export function BlockActionsPlugin() {
    const [editor] = useLexicalComposerContext();
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
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
                    (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
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
                const el = editor.getElementByKey(node.getKey()) as HTMLElement | null;
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                positions.push({
                    key: node.getKey(),
                    // Convert from viewport coords to content-space coords so the
                    // absolutely-positioned button scrolls in sync with the block.
                    top: rect.top - containerRect.top + scrollContainer.scrollTop,
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
                <div
                    key={key}
                    className="pointer-events-none absolute right-3 flex items-start"
                    style={{ top, height }}
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="pointer-events-auto size-6 text-muted-foreground/30 transition-colors hover:bg-muted hover:text-muted-foreground"
                            >
                                <Network className="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Connect block</TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </>,
        scrollContainer,
    );
}
