import {
    $getRoot,
    $isElementNode,
    $parseSerializedNode,
    $createParagraphNode,
    $createTextNode,
    IS_BOLD,
    IS_ITALIC,
    IS_UNDERLINE,
    type EditorState,
    type ElementNode,
    type LexicalEditor,
    type LexicalNode,
    type SerializedElementNode,
    type SerializedLexicalNode,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode, HeadingNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { ListNode } from '@lexical/list';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LexicalBlockKind =
    | 'paragraph'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'blockquote'
    | 'code'
    | 'bulletList'
    | 'numberedList'
    | 'divider';

export interface LexicalBlock {
    id: string;
    kind: LexicalBlockKind;
    /** Serialized Lexical node — round-trips through exportJSON / $parseSerializedNode */
    data: SerializedLexicalNode;
    /** 0-based position in the document */
    index: number;
    /** Plain-text content for full-text search / preview */
    text: string;
    parentId: string | null;
}

// ─── Old TextData format (backward compat) ────────────────────────────────────

type Mark = 'bold' | 'italic' | 'underline';
type TextData = { text: string; marks?: Mark[] };

function isTextDataArray(value: unknown): value is TextData[] {
    return (
        Array.isArray(value) &&
        (value.length === 0 || (typeof (value[0] as TextData).text === 'string'))
    );
}

function isSerializedNode(value: unknown): value is SerializedLexicalNode {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof (value as SerializedLexicalNode).type === 'string' &&
        typeof (value as SerializedLexicalNode).version === 'number'
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nodeToKind(node: LexicalNode): LexicalBlockKind | null {
    const type = node.getType();
    switch (type) {
        case 'paragraph':
            return 'paragraph';
        case 'heading':
            return `heading${(node as HeadingNode).getTag().replace('h', '')}` as LexicalBlockKind;
        case 'quote':
            return 'blockquote';
        case 'code':
            return 'code';
        case 'list':
            return (node as ListNode).getListType() === 'bullet' ? 'bulletList' : 'numberedList';
        case 'horizontalrule':
            return 'divider';
        case 'linebreak':
            return null; // inline node — never a top-level block
        default:
            return null;
    }
}

/**
 * Mirrors Lexical's internal `exportNodeToJSON` — `node.exportJSON()` alone
 * returns `children: []`; the children must be populated recursively by the
 * caller, which is what this function does.
 */
function exportNodeWithChildren(node: LexicalNode): SerializedLexicalNode {
    const serialized = node.exportJSON();
    if ($isElementNode(node)) {
        (serialized as unknown as SerializedElementNode).children =
            node.getChildren().map(exportNodeWithChildren);
    }
    return serialized;
}

/** Append TextData runs as formatted TextNodes to a parent element node. */
function appendTextData(parent: ElementNode, data: TextData[]) {
    for (const item of data) {
        const node = $createTextNode(item.text);
        let format = 0;
        if (item.marks?.includes('bold')) format |= IS_BOLD;
        if (item.marks?.includes('italic')) format |= IS_ITALIC;
        if (item.marks?.includes('underline')) format |= IS_UNDERLINE;
        if (format) node.setFormat(format);
        parent.append(node);
    }
}

// ─── editorStateToBlocks ──────────────────────────────────────────────────────

/**
 * Convert the current Lexical editor state to a `LexicalBlock[]` array.
 * `keyToId` maps each top-level Lexical node key to a stable UUID.
 * Nodes whose type is not recognised are silently skipped.
 */
export function editorStateToBlocks(
    editorState: EditorState,
    keyToId: Map<string, string>,
): LexicalBlock[] {
    const blocks: LexicalBlock[] = [];

    editorState.read(() => {
        const children = $getRoot().getChildren();
        let index = 0;

        for (const node of children) {
            const kind = nodeToKind(node);
            if (!kind) continue;

            const id = keyToId.get(node.getKey());
            if (!id) continue; // UUID not yet assigned — will be set on next update

            const data = exportNodeWithChildren(node);
            const text = node.getTextContent();

            blocks.push({ id, kind, data, index, text, parentId: null });
            index++;
        }
    });

    return blocks;
}

// ─── blocksToLexicalState ─────────────────────────────────────────────────────

/**
 * Returns a Lexical `initialEditorState` function that populates the editor
 * with the given blocks.  Pass this directly to `LexicalComposer`'s
 * `initialConfig.editorState`.
 *
 * Handles three data formats:
 *   1. SerializedLexicalNode (new format) — parsed directly with $parseSerializedNode
 *   2. TextData[] array (old format)      — reconstructed as a paragraph/heading/etc with text runs
 *   3. Empty / invalid                    — falls back to an empty paragraph
 */
export function blocksToLexicalState(
    blocks: LexicalBlock[],
): (editor: LexicalEditor) => void {
    return () => {
        const root = $getRoot();

        if (!blocks.length) {
            root.append($createParagraphNode());
            return;
        }

        for (const block of blocks) {
            const raw = block.data as unknown;

            // ── Case 1: Valid SerializedLexicalNode (current format) ──────────
            if (isSerializedNode(raw)) {
                try {
                    root.append($parseSerializedNode(raw));
                    continue;
                } catch {
                    // fall through to reconstruction
                }
            }

            // ── Case 2: Old TextData[] array ──────────────────────────────────
            if (isTextDataArray(raw)) {
                const data = raw as TextData[];
                switch (block.kind) {
                    case 'heading1':
                    case 'heading2':
                    case 'heading3': {
                        const tag = `h${block.kind.replace('heading', '')}` as 'h1' | 'h2' | 'h3';
                        const heading = $createHeadingNode(tag);
                        appendTextData(heading, data);
                        root.append(heading);
                        break;
                    }
                    case 'blockquote': {
                        const quote = $createQuoteNode();
                        appendTextData(quote, data);
                        root.append(quote);
                        break;
                    }
                    case 'code': {
                        const code = $createCodeNode();
                        const text = data.map((d) => d.text).join('');
                        if (text) code.append($createTextNode(text));
                        root.append(code);
                        break;
                    }
                    default: {
                        const para = $createParagraphNode();
                        appendTextData(para, data);
                        root.append(para);
                        break;
                    }
                }
                continue;
            }

            // ── Case 3: Empty / unrecognised — empty paragraph fallback ───────
            root.append($createParagraphNode());
        }
    };
}
