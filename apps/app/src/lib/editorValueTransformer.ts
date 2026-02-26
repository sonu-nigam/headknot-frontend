import { serializeMd } from '@platejs/markdown';
import { TElement, Value, NodeApi } from 'platejs';
import { PlateEditor } from 'platejs/react';

type BlockBase<K extends string, D> = {
    id: string;
    kind: K;
    data: D[];
    index: number;
    text: string;
    parentId: string | null;
};

export type Mark = 'bold' | 'italic' | 'underline';

export type TextData = { text: string; marks: Mark[] };
// export type CodeData = { language: string; text: string };
// export type LinkCardData = {
//     url: string;
//     title?: string;
//     description?: string;
//     site?: string;
// };
// export type QuoteData = { md: string; source_url?: string };
// export type ChecklistItem = { id: string; text: string; done: boolean };
// export type ChecklistData = { items: ChecklistItem[] };
// export type ImageData = { asset_id: string; alt?: string; caption_md?: string };
// export type FileData = { asset_id: string; name: string; mime: string };
// export type AudioData = { asset_id: string; duration_ms?: number };
// export type DividerData = {};
//

type TextBlockTypes =
    | 'paragraph'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'blockquote';

export type Block = BlockBase<TextBlockTypes, TextData>;

// --- helpers ---
function kindToNodeType(kind: TextBlockTypes): TElement['type'] {
    switch (kind) {
        case 'paragraph':
            return 'p';
        case 'blockquote':
            return 'blockquote';
        case 'heading1':
            return 'h1';
        case 'heading2':
            return 'h2';
        case 'heading3':
            return 'h3';
        default:
            return 'p';
    }
}

function nodeTypeToKind(type: TElement['type']): TextBlockTypes {
    switch (type) {
        case 'p':
            return 'paragraph';
        case 'blockquote':
            return 'blockquote';
        case 'h1':
            return 'heading1';
        case 'h2':
            return 'heading2';
        case 'h3':
            return 'heading3';
        default:
            return 'paragraph';
    }
}

function textDataToLeaf(d: TextData) {
    const leaf: any = { text: d.text ?? '' };
    if (d.marks?.includes('bold')) leaf.bold = true;
    if (d.marks?.includes('italic')) leaf.italic = true;
    if (d.marks?.includes('underline')) leaf.underline = true;
    return leaf;
}

function blockToElement(block: Block): TElement {
    const children = block.data?.length
        ? block.data.map(textDataToLeaf)
        : [{ text: '' }];

    return {
        id: block.id,
        type: kindToNodeType(block.kind as TextBlockTypes),
        children,
    } as TElement;
}

// --- main ---
export const blocksToEditor = (blocks: Block[]): Value => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return [{ type: 'p', children: [{ text: '' }] }] as unknown as Value;
    }

    return blocks.map(blockToElement) as unknown as Value;
};

function formatToTextBlock(
    node: TElement,
    idx: number,
    kind: TextBlockTypes,
    text: string,
): Block {
    return {
        id: node.id as string,
        kind,
        parentId: null,
        index: idx,
        text,
        data: node.children.map((item) => {
            const marks: Mark[] = [];
            if (item.bold) marks.push('bold' as Mark);
            if (item.italic) marks.push('italic' as Mark);
            if (item.underline) marks.push('underline' as Mark);

            return {
                text: item.text as string,
                marks,
            };
        }),
    };
}

export const editorToBlocks = (value: Value, editor: PlateEditor): Block[] => {
    const formattedValue: Block[] = [];

    for (let idx = 0; idx < value.length; idx++) {
        const node = value[idx];
        const text = NodeApi.string(node);

        formattedValue.push(
            formatToTextBlock(node, idx, nodeTypeToKind(node.type), text),
        );
    }

    return formattedValue;
};
