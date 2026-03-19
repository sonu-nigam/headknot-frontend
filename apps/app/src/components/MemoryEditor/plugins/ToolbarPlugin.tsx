import { useCallback, useEffect, useState } from 'react';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import { $isHeadingNode, $createHeadingNode, $isQuoteNode, $createQuoteNode } from '@lexical/rich-text';
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link,
    List,
    ListOrdered,
    MessageSquarePlus,
    Quote,
    Redo2,
    Strikethrough,
    Text,
    Underline,
    Undo2,
} from 'lucide-react';
import { FixedToolbar } from '@workspace/ui/components/fixed-toolbar';
import { Toggle } from '@workspace/ui/components/toggle';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { ADD_COMMENT_COMMAND, useCommentContext } from './CommentPlugin';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote' | 'bullet' | 'number' | 'other';

function getSelectedBlockType(): BlockType {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return 'other';
    const anchorNode = selection.anchor.getNode();
    const topElement =
        anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

    if ($isHeadingNode(topElement)) {
        const tag = topElement.getTag();
        if (tag === 'h1') return 'h1';
        if (tag === 'h2') return 'h2';
        if (tag === 'h3') return 'h3';
    }
    if ($isQuoteNode(topElement)) return 'quote';
    if ($isListNode(topElement)) {
        return topElement.getListType() === 'bullet' ? 'bullet' : 'number';
    }
    return 'paragraph';
}

// ─── Toolbar button wrappers ──────────────────────────────────────────────────

interface ToggleBtnProps {
    label: string;
    pressed: boolean;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

function ToggleBtn({ label, pressed, onClick, disabled, children }: ToggleBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    pressed={pressed}
                    onPressedChange={onClick}
                    disabled={disabled}
                    aria-label={label}
                >
                    {children}
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

interface ActionBtnProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

function ActionBtn({ label, onClick, disabled, children }: ActionBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClick}
                    disabled={disabled}
                    aria-label={label}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

function ToolbarDivider() {
    return (
        <div className="mx-1 py-1 self-stretch">
            <Separator orientation="vertical" />
        </div>
    );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { setActiveThreadId } = useCommentContext();

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [blockType, setBlockType] = useState<BlockType>('paragraph');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setHasSelection(!selection.isCollapsed());
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsCode(selection.hasFormat('code'));
            const node = selection.anchor.getNode();
            const parent = node.getParent();
            setIsLink($isLinkNode(parent) || $isLinkNode(node));
            setBlockType(getSelectedBlockType());
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(updateToolbar);
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => { updateToolbar(); return false; },
                COMMAND_PRIORITY_CRITICAL,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (p) => { setCanUndo(p); return false; },
                COMMAND_PRIORITY_CRITICAL,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (p) => { setCanRedo(p); return false; },
                COMMAND_PRIORITY_CRITICAL,
            ),
        );
    }, [editor, updateToolbar]);

    const setBlock = useCallback(
        (type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote') => {
            editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return;
                const visited = new Set<string>();
                selection.getNodes().forEach((node) => {
                    const block = node.getTopLevelElementOrThrow();
                    if (visited.has(block.getKey())) return;
                    visited.add(block.getKey());
                    if (type === 'paragraph') block.replace($createParagraphNode(), true);
                    else if (type === 'h1') block.replace($createHeadingNode('h1'), true);
                    else if (type === 'h2') block.replace($createHeadingNode('h2'), true);
                    else if (type === 'h3') block.replace($createHeadingNode('h3'), true);
                    else if (type === 'quote') block.replace($createQuoteNode(), true);
                });
            });
        },
        [editor],
    );

    const toggleList = useCallback(
        (listType: 'bullet' | 'number') => {
            if (listType === 'bullet') {
                editor.dispatchCommand(
                    blockType === 'bullet' ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
                    undefined,
                );
            } else {
                editor.dispatchCommand(
                    blockType === 'number' ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
                    undefined,
                );
            }
        },
        [editor, blockType],
    );

    const insertLink = useCallback(() => {
        if (!isLink) {
            const url = window.prompt('Enter URL:');
            if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    const addComment = useCallback(() => {
        const threadId = crypto.randomUUID();
        editor.dispatchCommand(ADD_COMMENT_COMMAND, threadId);
        setActiveThreadId(threadId);
    }, [editor, setActiveThreadId]);

    return (
        <FixedToolbar className="flex flex-wrap items-center gap-0.5 rounded-none border-x-0 border-t-0 px-2 py-1">
            {/* Undo / Redo */}
            <ActionBtn label="Undo (⌘Z)" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} disabled={!canUndo}>
                <Undo2 />
            </ActionBtn>
            <ActionBtn label="Redo (⌘⇧Z)" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} disabled={!canRedo}>
                <Redo2 />
            </ActionBtn>

            <ToolbarDivider />

            {/* Block type */}
            <ToggleBtn label="Paragraph" pressed={blockType === 'paragraph'} onClick={() => setBlock('paragraph')}>
                <Text />
            </ToggleBtn>
            <ToggleBtn label="Heading 1" pressed={blockType === 'h1'} onClick={() => setBlock('h1')}>
                <Heading1 />
            </ToggleBtn>
            <ToggleBtn label="Heading 2" pressed={blockType === 'h2'} onClick={() => setBlock('h2')}>
                <Heading2 />
            </ToggleBtn>
            <ToggleBtn label="Heading 3" pressed={blockType === 'h3'} onClick={() => setBlock('h3')}>
                <Heading3 />
            </ToggleBtn>

            <ToolbarDivider />

            {/* Text formatting */}
            <ToggleBtn label="Bold (⌘B)" pressed={isBold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                <Bold />
            </ToggleBtn>
            <ToggleBtn label="Italic (⌘I)" pressed={isItalic} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                <Italic />
            </ToggleBtn>
            <ToggleBtn label="Underline (⌘U)" pressed={isUnderline} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                <Underline />
            </ToggleBtn>
            <ToggleBtn label="Strikethrough" pressed={isStrikethrough} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                <Strikethrough />
            </ToggleBtn>

            <ToolbarDivider />

            {/* Block formatting */}
            <ToggleBtn label="Inline code" pressed={isCode} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>
                <Code />
            </ToggleBtn>
            <ToggleBtn label="Blockquote" pressed={blockType === 'quote'} onClick={() => setBlock('quote')}>
                <Quote />
            </ToggleBtn>

            <ToolbarDivider />

            {/* Lists */}
            <ToggleBtn label="Bullet list" pressed={blockType === 'bullet'} onClick={() => toggleList('bullet')}>
                <List />
            </ToggleBtn>
            <ToggleBtn label="Numbered list" pressed={blockType === 'number'} onClick={() => toggleList('number')}>
                <ListOrdered />
            </ToggleBtn>

            <ToolbarDivider />

            {/* Link */}
            <ToggleBtn label="Link" pressed={isLink} onClick={insertLink}>
                <Link />
            </ToggleBtn>

            <ToolbarDivider />

            {/* Comment */}
            <ActionBtn label="Add comment" onClick={addComment} disabled={!hasSelection}>
                <MessageSquarePlus />
            </ActionBtn>
        </FixedToolbar>
    );
}
