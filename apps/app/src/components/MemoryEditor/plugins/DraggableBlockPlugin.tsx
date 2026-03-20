import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { $createParagraphNode, $getNodeByKey, $getRoot } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BlockInsertMenu, type BlockInsertType } from '../components/BlockInsertMenu';

// ─── Block handle icon ────────────────────────────────────────────────────────

function BlockHandleIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M4 3C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H4ZM4 13C3.44772 13 3 13.4477 3 14V20C3 20.5523 3.44772 21 4 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H4ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13H14ZM15 19V15H19V19H15ZM5 9V5H9V9H5ZM5 19V15H9V19H5ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z" />
        </svg>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockPosition {
    key: string;
    top: number;
    height: number;
}

interface DropTarget {
    insertAfterKey: string | null;
    indicatorTop: number;
}

// ─── Helper: find drop target from a content-space Y coordinate ───────────────

function findDropTarget(
    contentY: number,
    positions: BlockPosition[],
    draggedKey: string,
): DropTarget {
    for (let i = 0; i < positions.length; i++) {
        const bp = positions[i];
        if (bp.key === draggedKey) continue;
        const mid = bp.top + bp.height / 2;
        if (contentY < mid) {
            let insertAfterKey: string | null = null;
            for (let j = i - 1; j >= 0; j--) {
                if (positions[j].key !== draggedKey) {
                    insertAfterKey = positions[j].key;
                    break;
                }
            }
            const anchor = insertAfterKey
                ? positions.find((p) => p.key === insertAfterKey)!
                : null;
            const indicatorTop = anchor ? anchor.top + anchor.height : bp.top;
            return { insertAfterKey, indicatorTop };
        }
    }
    const last = [...positions].reverse().find((p) => p.key !== draggedKey);
    if (!last) return { insertAfterKey: null, indicatorTop: 0 };
    return { insertAfterKey: last.key, indicatorTop: last.top + last.height };
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export function DraggableBlockPlugin() {
    const [editor] = useLexicalComposerContext();

    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
    const [blockPositions, setBlockPositions] = useState<BlockPosition[]>([]);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

    // Insert menu state
    const [menuTargetKey, setMenuTargetKey] = useState<string | null>(null);
    const [menuAnchorRect, setMenuAnchorRect] = useState<DOMRect | null>(null);

    // Refs so event handlers always read fresh values without re-binding
    const blockPositionsRef = useRef<BlockPosition[]>([]);
    const draggedKeyRef = useRef<string | null>(null);
    const dropTargetRef = useRef<DropTarget | null>(null);

    useEffect(() => { blockPositionsRef.current = blockPositions; }, [blockPositions]);
    useEffect(() => { dropTargetRef.current = dropTarget; }, [dropTarget]);

    // ── Find scroll container ─────────────────────────────────────────────────
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

    // ── Compute block positions ───────────────────────────────────────────────
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
                    top: rect.top - containerRect.top + scrollContainer.scrollTop,
                    height: rect.height,
                });
            }
        });

        setBlockPositions(positions);
    }, [editor, scrollContainer]);

    useEffect(
        () => editor.registerUpdateListener(() => requestAnimationFrame(computePositions)),
        [editor, computePositions],
    );
    useEffect(() => {
        window.addEventListener('resize', computePositions);
        return () => window.removeEventListener('resize', computePositions);
    }, [computePositions]);
    useEffect(() => {
        if (scrollContainer) requestAnimationFrame(computePositions);
    }, [scrollContainer, computePositions]);

    // ── Insert-after logic ────────────────────────────────────────────────────
    const insertBlockAfter = useCallback(
        (targetKey: string, type: BlockInsertType) => {
            setMenuTargetKey(null);
            setMenuAnchorRect(null);

            editor.update(() => {
                const target = $getNodeByKey(targetKey);
                if (!target) return;

                switch (type) {
                    case 'paragraph': {
                        const node = $createParagraphNode();
                        target.insertAfter(node);
                        node.selectEnd();
                        break;
                    }
                    case 'h1': {
                        const node = $createHeadingNode('h1');
                        target.insertAfter(node);
                        node.selectEnd();
                        break;
                    }
                    case 'h2': {
                        const node = $createHeadingNode('h2');
                        target.insertAfter(node);
                        node.selectEnd();
                        break;
                    }
                    case 'h3': {
                        const node = $createHeadingNode('h3');
                        target.insertAfter(node);
                        node.selectEnd();
                        break;
                    }
                    case 'quote': {
                        const node = $createQuoteNode();
                        target.insertAfter(node);
                        node.selectEnd();
                        break;
                    }
                    case 'code': {
                        const node = $createCodeNode();
                        target.insertAfter(node);
                        node.selectEnd();
                        break;
                    }
                    case 'divider': {
                        // Insert a paragraph after the target and select it,
                        // then dispatch INSERT_HORIZONTAL_RULE_COMMAND below (same pattern as lists)
                        const para = $createParagraphNode();
                        target.insertAfter(para);
                        para.selectEnd();
                        break;
                    }
                    default: {
                        // bullet / numbered: insert paragraph, then dispatch list command below
                        const para = $createParagraphNode();
                        target.insertAfter(para);
                        para.selectEnd();
                        break;
                    }
                }
            });

            // These commands need to run after the paragraph is inserted + selected
            if (type === 'bullet') {
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            } else if (type === 'numbered') {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            } else if (type === 'divider') {
                editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
            }
        },
        [editor],
    );

    // ── Drop zone event handlers ──────────────────────────────────────────────

    const handleDragOver = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            if (!draggedKeyRef.current || !scrollContainer) return;

            const containerRect = scrollContainer.getBoundingClientRect();
            const contentY = e.clientY - containerRect.top + scrollContainer.scrollTop;

            const target = findDropTarget(
                contentY,
                blockPositionsRef.current,
                draggedKeyRef.current,
            );
            setDropTarget((prev) =>
                prev?.insertAfterKey === target.insertAfterKey ? prev : target,
            );
        },
        [scrollContainer],
    );

    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            const draggedKey = draggedKeyRef.current;
            const target = dropTargetRef.current;

            draggedKeyRef.current = null;
            setDropTarget(null);
            setHoveredKey(null);

            if (!draggedKey || !target) return;
            const { insertAfterKey } = target;
            if (insertAfterKey === draggedKey) return;

            editor.update(() => {
                const draggedNode = $getNodeByKey(draggedKey);
                if (!draggedNode) return;

                if (insertAfterKey === null) {
                    const first = $getRoot().getFirstChild();
                    if (first && first.getKey() !== draggedKey) {
                        first.insertBefore(draggedNode);
                    }
                } else {
                    const anchor = $getNodeByKey(insertAfterKey);
                    anchor?.insertAfter(draggedNode);
                }
            });
        },
        [editor],
    );

    const handleDragEnd = useCallback(() => {
        draggedKeyRef.current = null;
        setDropTarget(null);
    }, []);

    // ── Hover detection: mousemove over the full scroll container width ────────
    useEffect(() => {
        if (!scrollContainer) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (draggedKeyRef.current) return;
            const containerRect = scrollContainer.getBoundingClientRect();
            const contentY = e.clientY - containerRect.top + scrollContainer.scrollTop;

            let found: string | null = null;
            for (const bp of blockPositionsRef.current) {
                if (contentY >= bp.top && contentY <= bp.top + bp.height) {
                    found = bp.key;
                    break;
                }
            }
            setHoveredKey((prev) => (prev === found ? prev : found));
        };

        const handleMouseLeave = () => {
            if (!draggedKeyRef.current) setHoveredKey(null);
        };

        scrollContainer.addEventListener('mousemove', handleMouseMove);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            scrollContainer.removeEventListener('mousemove', handleMouseMove);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [scrollContainer]);

    // ── Attach native drag/drop events to scroll container ────────────────────
    useEffect(() => {
        if (!scrollContainer) return;
        scrollContainer.addEventListener('dragover', handleDragOver);
        scrollContainer.addEventListener('drop', handleDrop);
        scrollContainer.addEventListener('dragend', handleDragEnd);
        return () => {
            scrollContainer.removeEventListener('dragover', handleDragOver);
            scrollContainer.removeEventListener('drop', handleDrop);
            scrollContainer.removeEventListener('dragend', handleDragEnd);
        };
    }, [scrollContainer, handleDragOver, handleDrop, handleDragEnd]);

    if (!scrollContainer) return null;

    return (
        <>
            {createPortal(
                <>
                    {/* Per-block handle rows */}
                    {blockPositions.map(({ key, top, height }) => {
                        const isVisible = hoveredKey === key && draggedKeyRef.current === null;
                        return (
                            <div
                                key={key}
                                className="pointer-events-none absolute left-0 flex items-start"
                                style={{ top, height, width: '48px' }}
                            >
                                {/* Single handle: click → open menu, drag → reorder */}
                                <div
                                    className="pointer-events-auto flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
                                    style={{
                                        opacity: isVisible || menuTargetKey === key ? 1 : 0,
                                        transition: 'opacity 150ms',
                                    }}
                                    draggable
                                    onClick={(e) => {
                                        // Only fires on genuine click, not after a drag
                                        const rect = (
                                            e.currentTarget as HTMLElement
                                        ).getBoundingClientRect();
                                        setMenuTargetKey(key);
                                        setMenuAnchorRect(rect);
                                    }}
                                    onDragStart={(e) => {
                                        draggedKeyRef.current = key;
                                        const ghost = document.createElement('div');
                                        document.body.appendChild(ghost);
                                        e.dataTransfer.setDragImage(ghost, 0, 0);
                                        requestAnimationFrame(() =>
                                            document.body.removeChild(ghost),
                                        );
                                    }}
                                >
                                    <BlockHandleIcon className="size-4 text-muted-foreground/40" />
                                </div>
                            </div>
                        );
                    })}

                    {/* Drop indicator line */}
                    {dropTarget && (
                        <div
                            className="pointer-events-none absolute left-0 right-0 z-50"
                            style={{ top: dropTarget.indicatorTop }}
                        >
                            <div className="mx-3 h-0.5 rounded-full bg-blue-500" />
                        </div>
                    )}
                </>,
                scrollContainer,
            )}

            {/* Insert menu — portaled to body so it isn't clipped */}
            {menuTargetKey && menuAnchorRect && (
                <BlockInsertMenu
                    anchorRect={menuAnchorRect}
                    onSelect={(type) => insertBlockAfter(menuTargetKey, type)}
                    onClose={() => {
                        setMenuTargetKey(null);
                        setMenuAnchorRect(null);
                    }}
                />
            )}
        </>
    );
}
