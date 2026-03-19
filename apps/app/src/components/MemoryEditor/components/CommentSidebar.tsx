import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { type Comment, useCommentContext } from '../plugins/CommentPlugin';
import { CommentThread } from './CommentThread';

export function CommentSidebar() {
    const [editor] = useLexicalComposerContext();
    const {
        threads,
        activeThreadId,
        setActiveThreadId,
        addComment,
        resolveThread,
    } = useCommentContext();

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

    return (
        <div
            className="flex-shrink-0 overflow-hidden border-l border-border bg-sidebar transition-all duration-200"
            style={{ width: activeThread ? '320px' : '0' }}
        >
            <div className="flex h-full w-80 flex-col">
                {activeThread && (
                    <CommentThread
                        thread={activeThread}
                        onReply={handleReply}
                        onResolve={handleResolve}
                        onClose={handleClose}
                    />
                )}
            </div>
        </div>
    );
}
