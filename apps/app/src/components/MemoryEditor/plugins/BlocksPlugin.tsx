import { useCallback, useEffect, useRef } from 'react';
import { $getRoot, type EditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {
    editorStateToBlocks,
    type LexicalBlock,
} from '@/lib/lexicalBlockTransformer';

interface BlocksPluginProps {
    /** Blocks loaded from the backend — used to seed the UUID map on first render */
    initialBlocks?: LexicalBlock[];
    onBlocksChange: (blocks: LexicalBlock[]) => void;
}

/**
 * Plugin that:
 * 1. Seeds a stable `nodeKey → UUID` map from the initial backend blocks (by
 *    index correlation on first render).
 * 2. Uses Lexical's OnChangePlugin to emit `LexicalBlock[]` on every content
 *    change (selection-only changes are ignored).
 */
export function BlocksPlugin({ initialBlocks, onBlocksChange }: BlocksPluginProps) {
    const [editor] = useLexicalComposerContext();

    // Persistent map: Lexical node key → stable UUID.
    const keyToIdRef = useRef<Map<string, string>>(new Map());

    // ── Seed map from initial backend blocks (runs once on mount) ─────────────
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
    }, []); // intentionally empty — runs once to correlate initial nodes to IDs

    // ── Assign UUIDs to new blocks + emit LexicalBlock[] on content change ────
    const handleChange = useCallback((editorState: EditorState) => {
        editorState.read(() => {
            for (const node of $getRoot().getChildren()) {
                if (!keyToIdRef.current.has(node.getKey())) {
                    keyToIdRef.current.set(node.getKey(), crypto.randomUUID());
                }
            }
        });

        onBlocksChange(editorStateToBlocks(editorState, keyToIdRef.current));
    }, [onBlocksChange]);

    return (
        <OnChangePlugin
            onChange={handleChange}
            ignoreSelectionChange
        />
    );
}
