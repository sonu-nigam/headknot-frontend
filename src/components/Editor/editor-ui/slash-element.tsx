'use client';

import React, { forwardRef, HTMLAttributes, useRef, useState } from 'react';

import { withRef } from '@udecode/cn';
// import { AIChatPlugin } from '@udecode/plate-ai/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
// import { DatePlugin } from '@udecode/plate-date/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import {
    EquationPlugin,
    InlineEquationPlugin,
} from '@udecode/plate-math/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { type PlateEditor, ParagraphPlugin, useEditorRef } from '@udecode/plate/react';
import { PlateElement } from '@udecode/plate/react';
import {
    CalendarIcon,
    ChevronRightIcon,
    Code2,
    Columns3Icon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListIcon,
    ListOrdered,
    PilcrowIcon,
    Quote,
    RadicalIcon,
    SparklesIcon,
    Square,
    Table,
    TableOfContentsIcon,
} from 'lucide-react';

import {
    insertBlock,
    insertInlineElement,
} from '@/components/Editor/transforms';

import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxGroupLabel,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';
import {
    type UseComboboxInputResult,
    useComboboxInput,
    useHTMLInputCursorState,
} from '@udecode/plate-combobox/react'
import { Combobox, ComboboxChevron, TextInput, useCombobox } from '@mantine/core';

type Group = {
    group: string;
    items: Item[];
};

interface Item {
    icon: React.ReactNode;

    value: string;

    onSelect: (editor: PlateEditor, value: string) => void;
    className?: string;
    focusEditor?: boolean;
    keywords?: string[];
    label?: string;
}

const groups: Group[] = [
    // {
    //     group: 'AI',
    //     items: [
    //         {
    //             focusEditor: false,
    //             icon: <SparklesIcon />,
    //             value: 'AI',
    //             onSelect: (editor) => {
    //                 editor.getApi(AIChatPlugin).aiChat.show();
    //             },
    //         },
    //     ],
    // },
    {
        group: 'Basic blocks',
        items: [
            {
                icon: <PilcrowIcon />,
                keywords: ['paragraph'],
                label: 'Text',
                value: ParagraphPlugin.key,
            },
            {
                icon: <Heading1Icon />,
                keywords: ['title', 'h1'],
                label: 'Heading 1',
                value: HEADING_KEYS.h1,
            },
            {
                icon: <Heading2Icon />,
                keywords: ['subtitle', 'h2'],
                label: 'Heading 2',
                value: HEADING_KEYS.h2,
            },
            {
                icon: <Heading3Icon />,
                keywords: ['subtitle', 'h3'],
                label: 'Heading 3',
                value: HEADING_KEYS.h3,
            },
            {
                icon: <ListIcon />,
                keywords: ['unordered', 'ul', '-'],
                label: 'Bulleted list',
                value: ListStyleType.Disc,
            },
            {
                icon: <ListOrdered />,
                keywords: ['ordered', 'ol', '1'],
                label: 'Numbered list',
                value: ListStyleType.Decimal,
            },
            {
                icon: <Square />,
                keywords: ['checklist', 'task', 'checkbox', '[]'],
                label: 'To-do list',
                value: INDENT_LIST_KEYS.todo,
            },
            {
                icon: <ChevronRightIcon />,
                keywords: ['collapsible', 'expandable'],
                label: 'Toggle',
                value: TogglePlugin.key,
            },
            {
                icon: <Code2 />,
                keywords: ['```'],
                label: 'Code Block',
                value: CodeBlockPlugin.key,
            },
            {
                icon: <Table />,
                label: 'Table',
                value: TablePlugin.key,
            },
            {
                icon: <Quote />,
                keywords: ['citation', 'blockquote', 'quote', '>'],
                label: 'Blockquote',
                value: BlockquotePlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Advanced blocks',
        items: [
            {
                icon: <TableOfContentsIcon />,
                keywords: ['toc'],
                label: 'Table of contents',
                value: TocPlugin.key,
            },
            {
                icon: <Columns3Icon />,
                label: '3 columns',
                value: 'action_three_columns',
            },
            {
                focusEditor: false,
                icon: <RadicalIcon />,
                label: 'Equation',
                value: EquationPlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Inline',
        items: [
            // {
            //     focusEditor: true,
            //     icon: <CalendarIcon />,
            //     keywords: ['time'],
            //     label: 'Date',
            //     value: DatePlugin.key,
            // },
            {
                focusEditor: false,
                icon: <RadicalIcon />,
                label: 'Inline Equation',
                value: InlineEquationPlugin.key,
            },
        ].map((item) => ({
            ...item,
            onSelect: (editor, value) => {
                insertInlineElement(editor, value);
            },
        })),
    },
];

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

export const SlashInputElement = withRef<typeof PlateElement>(
    ({ className, ...props }, ref) => {
        const { children, editor, element } = props;
        const combobox = useCombobox();
        const [value, setValue] = useState('');
        const shouldFilterOptions = !groceries.some((item) => item === value);
        const filteredOptions = shouldFilterOptions
            ? groceries.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
            : groceries;

        const options = filteredOptions.map((item) => (
            <Combobox.Option value={item} key={item}>
            {item}
            </Combobox.Option>
        ));

        return (
            <PlateElement
                ref={ref}
                as="span"
                className={className}
                data-slate-value={element.value}
                {...props}
            >
                {/* <Combobox
                    onOptionSubmit={(optionValue) => {
                        setValue(optionValue);
                        combobox.closeDropdown();
                    }}
                    store={combobox}
                    >
                    <Combobox.Target>
                        <InputElement
                            value={value}
                            onChange={(event) => {
                                setValue(event.currentTarget.value);
                                combobox.openDropdown();
                                combobox.updateSelectedOptionIndex();
                            }}
                            onClick={() => combobox.openDropdown()}
                            onFocus={() => combobox.openDropdown()}
                            onBlur={() => combobox.closeDropdown()}
                        />
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Options>
                        {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                        </Combobox.Options>
                    </Combobox.Dropdown>
                    </Combobox> */}

                {children}
            </PlateElement>
        );
    }
);

const InputElement = forwardRef<
    HTMLInputElement,
    HTMLAttributes<HTMLInputElement>
>(({ className, value, trigger,  ...props }, propRef) => {

    const editor = useEditorRef();
    const inputRef = useRef(null);
    const cursorState = useHTMLInputCursorState(inputRef);
    const { props: inputProps, removeInput } = useComboboxInput({
        cancelInputOnBlur: false,
        cursorState,
        ref: inputRef,
        onCancelInput: (cause) => {
            if (cause !== 'backspace') {
                editor.tf.insertText(trigger + value, {
                    at: insertPoint?.current ?? undefined,
                });
            }
            if (cause === 'arrowLeft' || cause === 'arrowRight') {
                editor.tf.move({
                    distance: 1,
                    reverse: cause === 'arrowLeft',
                });
            }
        },
    });


    /**
     * To create an auto-resizing input, we render a visually hidden span
     * containing the input value and position the input element on top of it.
     * This works well for all cases except when input exceeds the width of the
     * container.
     */

    return (
        <>
            {trigger}

            <span className="relative min-h-[1lh]">
                <span
                    className="invisible overflow-hidden text-nowrap"
                    aria-hidden="true"
                >
                    {value || '\u200B'}
                </span>
                <TextInput
                    placeholder="Pick value or type anything"
                    value={value}
                    {...props}
                    {...inputProps}
                />
                
            </span>
        </>
    );
});

InputElement.displayName = 'InputElement';