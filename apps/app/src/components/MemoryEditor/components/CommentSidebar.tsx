import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@workspace/ui/components/sheet';
import { type Comment, useCommentContext } from '../plugins/CommentPlugin';
import { CommentThread } from './CommentThread';

export function CommentSidebar() {
    const [editor] = useLexicalComposerContext();
    const isMobile = useIsMobile();
    const {
        threads,
        activeThreadId,
        setActiveThreadId,
        addComment,
        resolveThread,
    } = useCommentContext();

    // Keep a ref to the portal slot so we re-render once it's in the DOM
    const [slotEl, setSlotEl] = useState<HTMLElement | null>(null);
    useEffect(() => {
        const el = document.getElementById('context-panel-slot');
        setSlotEl(el);
    }, []);

    const activeThread = activeThreadId
        ? threads.find((t) => t.id === activeThreadId) ?? null
        : null;

    const handleReply = useCallback(
        (text: string) => {
            if (!activeThreadId) return;
            const comment: Comment = {
                id: crypto.randomUUID(),
                author: 'You',
                text,
                createdAt: new Date(),
            };
            addComment(activeThreadId, comment);
        },
        [activeThreadId, addComment],
    );

    const handleResolve = useCallback(() => {
        if (!activeThreadId) return;
        resolveThread(activeThreadId, editor);
    }, [activeThreadId, resolveThread, editor]);

    const handleClose = useCallback(() => {
        setActiveThreadId(null);
    }, [setActiveThreadId]);

    const threadContent = activeThread ? (
        <CommentThread
            thread={activeThread}
            onReply={handleReply}
            onResolve={handleResolve}
            onClose={handleClose}
        />
    ) : null;

    // ── Mobile: Sheet (offcanvas, same as AppSidebar on mobile) ──────────────
    if (isMobile) {
        return (
            <Sheet
                open={!!activeThread}
                onOpenChange={(open) => { if (!open) setActiveThreadId(null); }}
            >
                <SheetContent
                    side="right"
                    className="w-80 p-0 bg-sidebar text-sidebar-foreground [&>button]:hidden"
                >
                    <SheetTitle className="sr-only">Comment Thread</SheetTitle>
                    <div className="flex h-full flex-col">{threadContent}</div>
                </SheetContent>
            </Sheet>
        );
    }

    // ── Desktop: portal into the slot rendered by AppLayout's right Sidebar ──
    if (!slotEl) return null;
    return createPortal(
        <div className="flex h-full flex-col">{threadContent}</div>,
        slotEl,
    );
}
