import { QuickCaptureFormValues } from '@/validations/form/QuickCaptureForm';
import { memo } from 'react';
import { useThrottleFn } from 'ahooks';
import { Title } from './Title';
import { Content } from './Content';
import { Block } from '@/lib/editorValueTransformer';

const initialContent: Block[] = [
    {
        id: 'c9c1f9a2-3d7d-4c2f-9d7d-2a1b3c4d5e6f',
        kind: 'heading1',
        index: 0,
        parentId: null,
        data: [{ text: 'Headknot: Quick Capture Demo', marks: [] }],
    },
    {
        id: '2c8a7d41-8fdb-4a8e-9c3d-8f7e4a1b2c3d',
        kind: 'paragraph',
        index: 1,
        parentId: null,
        data: [
            { text: 'This paragraph shows ', marks: [] },
            { text: 'bold', marks: ['bold'] },
            { text: ', ', marks: [] },
            { text: 'italic', marks: ['italic'] },
            { text: ', and ', marks: [] },
            { text: 'underline', marks: ['underline'] },
            { text: ' marks in separate segments.', marks: [] },
        ],
    },
    {
        id: '7a0f2c9b-5b1c-4a8f-b7d1-12e3f45a6b7c',
        kind: 'heading2',
        index: 2,
        parentId: null,
        data: [{ text: 'Why Blocks?', marks: [] }],
    },
    {
        id: 'a1b2c3d4-e5f6-47a8-9b0c-d1e2f3a4b5c6',
        kind: 'paragraph',
        index: 3,
        parentId: null,
        data: [
            {
                text: 'Blocks keep your content structured, enabling ',
                marks: [],
            },
            { text: 'typed transforms', marks: ['italic'] },
            { text: ' and clean persistence.', marks: [] },
        ],
    },
    {
        id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
        kind: 'blockquote',
        index: 4,
        parentId: null,
        data: [
            {
                text: '“The faintest ink is better than the strongest memory.”',
                marks: [],
            },
        ],
    },
    {
        id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
        kind: 'heading3',
        index: 5,
        parentId: null,
        data: [{ text: 'Next Steps', marks: [] }],
    },
    {
        id: '9f86d081-884c-4b3d-9f1e-3d9d9a5a9f1e',
        kind: 'paragraph',
        index: 6,
        parentId: null,
        data: [
            {
                text: 'Try editing this content and convert it with ',
                marks: [],
            },
            { text: 'editorToBlocks', marks: ['bold'] },
            { text: ' or render it via ', marks: [] },
            { text: 'blocksToEditor', marks: ['bold', 'underline'] },
            { text: '.', marks: [] },
        ],
    },
];

const initialTitle = 'New Text Memory';

export function QuickCaptureFormComponent({
    onSubmit,
    onInvalid,
    memoryId,
}: {
    onSubmit: (data: QuickCaptureFormValues) => void | Promise<void>;
    onInvalid?: () => void;
    memoryId: string;
}) {
    return (
        <>
            <div className="mt-20">
                <Title initialValue={''} memoryId={memoryId} />
            </div>
            <div className="mt-10">
                <Content initialValue={[]} memoryId={memoryId} />
            </div>
        </>
    );
}

export const QuickCaptureForm = memo(QuickCaptureFormComponent);
