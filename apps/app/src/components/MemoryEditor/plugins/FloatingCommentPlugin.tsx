import { useCallback, useEffect, useRef, useState } from 'react';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createPortal } from 'react-dom';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { ADD_COMMENT_COMMAND, useCommentContext } from './CommentPlugin';

export function FloatingCommentPlugin() {
    const [editor] = useLexicalComposerContext();
    const { setActiveThreadId } = useCommentContext();

    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const mouseDownRef = useRef(false);

    const updatePosition = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            const domSelection = window.getSelection();
            if (domSelection && domSelection.rangeCount > 0) {
                const range = domSelection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                if (rect.width > 0) {
                    setPosition({
                        top: rect.top + window.scrollY - 44,
                        left: rect.left + window.scrollX + rect.width / 2 - 60,
                    });
                    return;
                }
            }
        }
        setPosition(null);
    }, []);

    useEffect(() => {
        const onMouseDown = () => {
            mouseDownRef.current = true;
        };
        const onMouseUp = () => {
            mouseDownRef.current = false;
            editor.getEditorState().read(updatePosition);
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [editor, updatePosition]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                if (!mouseDownRef.current) {
                    updatePosition();
                }
                return false;
            },
            COMMAND_PRIORITY_LOW,
        );
    }, [editor, updatePosition]);

    const handleAddComment = useCallback(() => {
        const threadId = crypto.randomUUID();
        editor.dispatchCommand(ADD_COMMENT_COMMAND, threadId);
        setActiveThreadId(threadId);
        setPosition(null);
    }, [editor, setActiveThreadId]);

    if (!position) return null;

    return createPortal(
        <div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                zIndex: 100,
            }}
            onMouseDown={(e) => e.preventDefault()}
        >
            <Button
                size="sm"
                variant="outline"
                className="gap-1.5 shadow-md"
                onClick={handleAddComment}
            >
                <MessageSquarePlus className="size-3.5" />
                Comment
            </Button>
        </div>,
        document.body,
    );
}
