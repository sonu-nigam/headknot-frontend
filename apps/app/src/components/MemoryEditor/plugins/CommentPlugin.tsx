import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useRef,
    type ReactNode,
} from 'react';
import {
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    createCommand,
    type LexicalCommand,
    type LexicalEditor,
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import { $wrapSelectionInMarkNode, $isMarkNode, MarkNode } from '@lexical/mark';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { contextPanelStore } from '@/state/contextPanelStore';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: Date;
}

export interface CommentThread {
    id: string;
    quote: string;
    comments: Comment[];
    resolved: boolean;
}

// ─── Command ─────────────────────────────────────────────────────────────────

export const ADD_COMMENT_COMMAND: LexicalCommand<string> =
    createCommand('ADD_COMMENT_COMMAND');

// ─── Store / Reducer ─────────────────────────────────────────────────────────

type StoreAction =
    | { type: 'ADD_THREAD'; thread: CommentThread }
    | { type: 'ADD_COMMENT'; threadId: string; comment: Comment }
    | { type: 'RESOLVE_THREAD'; threadId: string }
    | { type: 'DELETE_THREAD'; threadId: string };

function threadsReducer(
    state: CommentThread[],
    action: StoreAction,
): CommentThread[] {
    switch (action.type) {
        case 'ADD_THREAD':
            return [...state, action.thread];
        case 'ADD_COMMENT':
            return state.map((t) =>
                t.id === action.threadId
                    ? { ...t, comments: [...t.comments, action.comment] }
                    : t,
            );
        case 'RESOLVE_THREAD':
            return state.map((t) =>
                t.id === action.threadId ? { ...t, resolved: true } : t,
            );
        case 'DELETE_THREAD':
            return state.filter((t) => t.id !== action.threadId);
        default:
            return state;
    }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CommentContextValue {
    threads: CommentThread[];
    activeThreadId: string | null;
    setActiveThreadId: (id: string | null) => void;
    addThread: (thread: CommentThread) => void;
    addComment: (threadId: string, comment: Comment) => void;
    resolveThread: (threadId: string, editor: LexicalEditor) => void;
    deleteThread: (threadId: string, editor: LexicalEditor) => void;
}

const CommentContext = createContext<CommentContextValue | null>(null);

export function useCommentContext(): CommentContextValue {
    const ctx = useContext(CommentContext);
    if (!ctx) throw new Error('useCommentContext must be inside CommentPlugin');
    return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface CommentProviderProps {
    children: ReactNode;
    editor: LexicalEditor;
}

function CommentProvider({ children, editor }: CommentProviderProps) {
    const [threads, dispatch] = useReducer(threadsReducer, []);
    const activeThreadIdRef = useRef<string | null>(null);
    const [activeThreadId, setActiveThreadIdState] = useReducer(
        (_: string | null, next: string | null) => {
            activeThreadIdRef.current = next;
            if (next !== null) contextPanelStore.open('Comments');
            else contextPanelStore.close();
            return next;
        },
        null,
    );

    const addThread = useCallback(
        (thread: CommentThread) => dispatch({ type: 'ADD_THREAD', thread }),
        [],
    );

    const addComment = useCallback((threadId: string, comment: Comment) => {
        dispatch({ type: 'ADD_COMMENT', threadId, comment });
    }, []);

    const resolveThread = useCallback(
        (threadId: string, ed: LexicalEditor) => {
            dispatch({ type: 'RESOLVE_THREAD', threadId });
            // remove the mark node from the editor
            ed.update(() => {
                const markNodes = ed
                    .getEditorState()
                    .read(() => {
                        const root = ed.getEditorState()._nodeMap;
                        const marks: MarkNode[] = [];
                        root.forEach((node) => {
                            if ($isMarkNode(node)) {
                                const ids = node.getIDs();
                                if (ids.includes(threadId)) marks.push(node as MarkNode);
                            }
                        });
                        return marks;
                    });
                markNodes.forEach((mark) => {
                    mark.getChildren().forEach((child) => mark.insertBefore(child));
                    mark.remove();
                });
            });
            setActiveThreadIdState(null);
        },
        [],
    );

    const deleteThread = useCallback(
        (threadId: string, ed: LexicalEditor) => {
            resolveThread(threadId, ed);
            dispatch({ type: 'DELETE_THREAD', threadId });
        },
        [resolveThread],
    );

    return (
        <CommentContext.Provider
            value={{
                threads,
                activeThreadId,
                setActiveThreadId: setActiveThreadIdState,
                addThread,
                addComment,
                resolveThread,
                deleteThread,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
}

// ─── Plugin (registers commands) ─────────────────────────────────────────────

function CommentPluginInner() {
    const [editor] = useLexicalComposerContext();
    const { addThread, setActiveThreadId } = useCommentContext();

    useEffect(() => {
        return mergeRegister(
            // Handle ADD_COMMENT_COMMAND
            editor.registerCommand<string>(
                ADD_COMMENT_COMMAND,
                (threadId) => {
                    editor.update(() => {
                        const selection = $getSelection();
                        if (!$isRangeSelection(selection) || selection.isCollapsed())
                            return;

                        const quote = selection.getTextContent();

                        $wrapSelectionInMarkNode(
                            selection,
                            selection.isBackward(),
                            threadId,
                        );

                        const newThread: CommentThread = {
                            id: threadId,
                            quote,
                            comments: [],
                            resolved: false,
                        };
                        addThread(newThread);
                        setActiveThreadId(threadId);
                    });
                    return true;
                },
                COMMAND_PRIORITY_LOW,
            ),

            // Detect clicks on MarkNode → open sidebar
            editor.registerCommand<MouseEvent>(
                CLICK_COMMAND,
                (event) => {
                    const target = event.target as HTMLElement;
                    const markEl = target.closest('[data-lexical-mark]') as HTMLElement | null;
                    if (markEl) {
                        // Find the thread id from the DOM attribute we'll set via a custom theme
                        // Alternatively walk the editor state to find the mark node under cursor
                        const domNode = target;
                        let node = editor.getEditorState().read(() => {
                            // Walk nodes to find one that has an element matching the DOM
                            let found: string | null = null;
                            editor.getEditorState()._nodeMap.forEach((n) => {
                                if ($isMarkNode(n)) {
                                    const el = editor.getElementByKey(n.getKey());
                                    if (el && (el === domNode || el.contains(domNode))) {
                                        const ids = (n as MarkNode).getIDs();
                                        if (ids.length > 0) found = ids[0];
                                    }
                                }
                            });
                            return found;
                        });
                        if (node) {
                            setActiveThreadId(node);
                            return true;
                        }
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [editor, addThread, setActiveThreadId]);

    return null;
}

// ─── Public export ────────────────────────────────────────────────────────────

export function CommentPlugin({ children }: { children?: ReactNode }) {
    const [editor] = useLexicalComposerContext();
    return (
        <CommentProvider editor={editor}>
            <CommentPluginInner />
            {children}
        </CommentProvider>
    );
}
