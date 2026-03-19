import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkNode } from '@lexical/mark';
import { TRANSFORMERS } from '@lexical/markdown';
import type { EditorState } from 'lexical';

import { MemoryEditorTheme } from './MemoryEditorTheme';
import { CommentPlugin } from './plugins/CommentPlugin';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { SlashMenuPlugin } from './plugins/SlashMenuPlugin';
import { FloatingCommentPlugin } from './plugins/FloatingCommentPlugin';
import { CommentSidebar } from './components/CommentSidebar';

// ─── Types ───────────────────────────────────────────────────────────────────

interface MemoryEditorProps {
    initialEditorState?: string | null;
    onChange?: (editorStateJson: string) => void;
    placeholder?: string;
}

// ─── Inner layout (requires both LexicalComposer and CommentPlugin contexts) ─

function MemoryEditorLayout({
    placeholder,
    onChange,
}: Pick<MemoryEditorProps, 'placeholder' | 'onChange'>) {
    const handleChange = (editorState: EditorState) => {
        onChange?.(JSON.stringify(editorState.toJSON()));
    };

    return (
        <div className="flex flex-col h-full">
            {/* Sticky toolbar */}
            {/* <ToolbarPlugin /> */}

            {/* Editor body + comments sidebar */}
            <div className="flex flex-1 overflow-hidden">
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
                            <div className="pointer-events-none absolute top-6 left-12 text-muted-foreground select-none text-base">
                                {placeholder}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>

                {/* Comment sidebar (slides in when a thread is active) */}
                <CommentSidebar />
            </div>

            {/* Null-returning plugins */}
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <HorizontalRulePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {onChange && <OnChangePlugin onChange={handleChange} />}
            <SlashMenuPlugin />
            <FloatingCommentPlugin />
        </div>
    );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function MemoryEditor({
    initialEditorState,
    onChange,
    placeholder = 'Start writing, or press "/" for commands…',
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
        editorState: initialEditorState ?? null,
        onError: (error: Error) => {
            console.error('[MemoryEditor]', error);
        },
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            {/*
             * CommentPlugin is a context provider.
             * Everything inside has access to both Lexical and Comment contexts.
             */}
            <CommentPlugin>
                <MemoryEditorLayout placeholder={placeholder} onChange={onChange} />
            </CommentPlugin>
        </LexicalComposer>
    );
}
