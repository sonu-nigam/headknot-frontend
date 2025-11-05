import { TElement, Value } from 'platejs';

type BlockBase<K extends string, D> = {
    id: string;
    kind: K;
    data: D[];
    index: number;
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

export type TextBlock = BlockBase<TextBlockTypes, TextData>;
// export type CodeBlock = BlockBase<'code', CodeData>;
// export type LinkCardBlock = BlockBase<'link-card', LinkCardData>;
// export type QuoteBlock = BlockBase<'quote', QuoteData>;
// export type ChecklistBlock = BlockBase<'checklist', ChecklistData>;
// export type ImageBlock = BlockBase<'image', ImageData>;
// export type FileBlock = BlockBase<'file', FileData>;
// export type AudioBlock = BlockBase<'audio', AudioData>;
// export type DividerBlock = BlockBase<'divider', DividerData>;

export type Block = TextBlock;
// | CodeBlock
// | LinkCardBlock
// | QuoteBlock
// | ChecklistBlock
// | ImageBlock
// | FileBlock
// | AudioBlock
// | DividerBlock;

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
): TextBlock {
    return {
        id: node.id as string,
        kind,
        parentId: null,
        index: idx,
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

export const editorToBlocks = (value: Value) => {
    const formattedValue: Block[] = [];

    for (let idx = 0; idx < value.length; idx++) {
        const node = value[idx];

        switch (node.type) {
            case 'p':
                formattedValue.push(formatToTextBlock(node, idx, 'paragraph'));
                break;
            case 'blockquote':
                formattedValue.push(formatToTextBlock(node, idx, 'blockquote'));
                break;
            case 'h1':
                formattedValue.push(formatToTextBlock(node, idx, 'heading1'));
                break;
            case 'h2':
                formattedValue.push(formatToTextBlock(node, idx, 'heading2'));
                break;
            case 'h3':
                formattedValue.push(formatToTextBlock(node, idx, 'heading3'));
                break;
        }
    }

    return formattedValue;
};
