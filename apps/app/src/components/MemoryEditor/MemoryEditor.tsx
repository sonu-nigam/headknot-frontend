import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkNode } from '@lexical/mark';
import { TRANSFORMERS } from '@lexical/markdown';
import { $getRoot, type EditorState } from 'lexical';
import { useCallback, useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { blocksToLexicalState, editorStateToBlocks, type LexicalBlock } from '@/lib/lexicalBlockTransformer';
import { MemoryEditorTheme } from './MemoryEditorTheme';
import { CommentPlugin } from './plugins/CommentPlugin';
import { SlashMenuPlugin } from './plugins/SlashMenuPlugin';
import { FloatingCommentPlugin } from './plugins/FloatingCommentPlugin';
import { BlockActionsPlugin } from './plugins/BlockActionsPlugin';
import { DraggableBlockPlugin } from './plugins/DraggableBlockPlugin';
import { CommentSidebar } from './components/CommentSidebar';
import { RelationshipsPanel } from './components/RelationshipsPanel';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MemoryEditorProps {
    initialBlocks?: LexicalBlock[];
    onBlocksChange?: (blocks: LexicalBlock[]) => void;
    placeholder?: string;
    memoryId?: string;
}

// ─── Inner layout ─────────────────────────────────────────────────────────────

function MemoryEditorLayout({
    placeholder,
    initialBlocks,
    onBlocksChange,
    memoryId,
}: Pick<MemoryEditorProps, 'placeholder' | 'initialBlocks' | 'onBlocksChange' | 'memoryId'>) {
    const [editor] = useLexicalComposerContext();

    // Stable node-key → UUID map; survives re-renders without triggering them
    const keyToIdRef = useRef<Map<string, string>>(new Map());

    // Seed UUIDs from initial backend blocks (index-correlated, runs once)
    useEffect(() => {
        if (!initialBlocks?.length) return;
        editor.getEditorState().read(() => {
            const children = $getRoot().getChildren();
            initialBlocks.forEach((block, i) => {
                const node = children[i];
                if (node) keyToIdRef.current.set(node.getKey(), block.id);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally empty — one-time correlation on mount

    const handleChange = useCallback((editorState: EditorState) => {
        // Assign stable UUIDs to any new top-level nodes
        editorState.read(() => {
            for (const node of $getRoot().getChildren()) {
                if (!keyToIdRef.current.has(node.getKey())) {
                    keyToIdRef.current.set(node.getKey(), crypto.randomUUID());
                }
            }
        });
        onBlocksChange?.(editorStateToBlocks(editorState, keyToIdRef.current));
    }, [onBlocksChange]);

    return (
        <div className="flex flex-col h-full">
            {/* Editor content */}
            <div className="relative flex-1 overflow-y-auto px-12 pt-6 pb-72">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className="outline-none min-h-[200px] text-base"
                            aria-label="Memory editor content"
                        />
                    }
                    placeholder={
                        <div className="pointer-events-none absolute top-6 left-12 select-none text-base text-muted-foreground/40">
                            {placeholder}
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>

            {/* Comment sidebar — portals to document.body at full screen height */}
            <CommentSidebar />
            <RelationshipsPanel />

            {/* Null-returning plugins */}
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <HorizontalRulePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <SlashMenuPlugin />
            <FloatingCommentPlugin />
            <BlockActionsPlugin keyToIdRef={keyToIdRef} memoryId={memoryId} />
            <DraggableBlockPlugin />

            {/* Emit LexicalBlock[] on every content change (selection changes ignored) */}
            {onBlocksChange && (
                <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
            )}
        </div>
    );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function MemoryEditor({
    initialBlocks,
    onBlocksChange,
    placeholder = 'Start writing, or press "/" for commands…',
    memoryId,
}: MemoryEditorProps) {
    const initialConfig: InitialConfigType = {
        namespace: 'MemoryEditor',
        theme: MemoryEditorTheme,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            LinkNode,
            AutoLinkNode,
            CodeNode,
            CodeHighlightNode,
            HorizontalRuleNode,
            MarkNode,
        ],
        editorState: initialBlocks?.length ? blocksToLexicalState(initialBlocks) : null,
        onError: (error: Error) => {
            console.error('[MemoryEditor]', error);
        },
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <CommentPlugin>
                <MemoryEditorLayout
                    placeholder={placeholder}
                    initialBlocks={initialBlocks}
                    onBlocksChange={onBlocksChange}
                    memoryId={memoryId}
                />
            </CommentPlugin>
        </LexicalComposer>
    );
}
