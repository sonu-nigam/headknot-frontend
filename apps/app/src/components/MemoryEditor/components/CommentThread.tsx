import { useState, useRef, useCallback } from 'react';
import { CheckCheck, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { type Comment, type CommentThread as CommentThreadType } from '../plugins/CommentPlugin';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface CommentThreadProps {
    thread: CommentThreadType;
    onReply: (text: string) => void;
    onResolve: () => void;
    onClose: () => void;
}

function formatTime(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
}

function initials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function CommentItem({ comment }: { comment: Comment }) {
    return (
        <div className="flex gap-2.5">
            <Avatar size="sm" className="mt-0.5 shrink-0">
                <AvatarFallback className="text-xs">
                    {initials(comment.author)}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                        {formatTime(comment.createdAt)}
                    </span>
                </div>
                <p className="mt-0.5 text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {comment.text}
                </p>
            </div>
        </div>
    );
}

export function CommentThread({ thread, onReply, onResolve, onClose }: CommentThreadProps) {
    const [replyText, setReplyText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleReply = useCallback(() => {
        const text = replyText.trim();
        if (!text) return;
        onReply(text);
        setReplyText('');
    }, [replyText, onReply]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleReply();
            }
        },
        [handleReply],
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-border">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Comment
                    </p>
                    {thread.quote && (
                        <p className="text-sm text-foreground line-clamp-2 italic">
                            "{thread.quote}"
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={onResolve}
                        title="Resolve thread"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <CheckCheck className="size-4" />
                    </Button>
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={onClose}
                        title="Close"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {thread.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No comments yet. Add one below.
                    </p>
                ) : (
                    thread.comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                )}
            </div>

            {/* Reply input */}
            <div className="px-4 pb-4 pt-3 border-t border-border space-y-2">
                <Textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply... (⌘↵ to send)"
                    className="min-h-[72px] resize-none text-sm"
                />
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                    >
                        Reply
                    </Button>
                </div>
            </div>
        </div>
    );
}
