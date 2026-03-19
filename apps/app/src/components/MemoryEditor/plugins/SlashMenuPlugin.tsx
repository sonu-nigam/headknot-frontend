import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    type LexicalEditor,
    type TextNode,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    LexicalTypeaheadMenuPlugin,
    MenuOption,
    useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Minus,
    Quote,
    Text,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

// ─── Option definition ───────────────────────────────────────────────────────

class SlashMenuOption extends MenuOption {
    title: string;
    icon: LucideIcon;
    keywords: string[];
    group: string;
    onSelect: (editor: LexicalEditor) => void;

    constructor(
        title: string,
        icon: LucideIcon,
        keywords: string[],
        group: string,
        onSelect: (editor: LexicalEditor) => void,
    ) {
        super(title);
        this.title = title;
        this.icon = icon;
        this.keywords = keywords;
        this.group = group;
        this.onSelect = onSelect.bind(this);
    }
}

function opt(
    title: string,
    icon: LucideIcon,
    keywords: string[],
    group: string,
    onSelect: (editor: LexicalEditor) => void,
) {
    return new SlashMenuOption(title, icon, keywords, group, onSelect);
}

const ALL_OPTIONS: SlashMenuOption[] = [
    opt('Text', Text, ['text', 'paragraph', 'p'], 'Basic', (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            selection.anchor.getNode().getTopLevelElementOrThrow().replace($createParagraphNode(), true);
        });
    }),
    opt('Heading 1', Heading1, ['h1', 'heading', 'heading1'], 'Basic', (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            selection.anchor.getNode().getTopLevelElementOrThrow().replace($createHeadingNode('h1'), true);
        });
    }),
    opt('Heading 2', Heading2, ['h2', 'heading', 'heading2'], 'Basic', (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            selection.anchor.getNode().getTopLevelElementOrThrow().replace($createHeadingNode('h2'), true);
        });
    }),
    opt('Heading 3', Heading3, ['h3', 'heading', 'heading3'], 'Basic', (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            selection.anchor.getNode().getTopLevelElementOrThrow().replace($createHeadingNode('h3'), true);
        });
    }),
    opt('Bullet List', List, ['bullet', 'ul', 'unordered', 'list'], 'List', (editor) => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }),
    opt('Numbered List', ListOrdered, ['numbered', 'ol', 'ordered', 'list'], 'List', (editor) => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }),
    opt('Quote', Quote, ['quote', 'blockquote', 'callout'], 'Media', (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            selection.anchor.getNode().getTopLevelElementOrThrow().replace($createQuoteNode(), true);
        });
    }),
    opt('Code Block', Code, ['code', 'pre', 'codeblock'], 'Media', (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            selection.anchor.getNode().getTopLevelElementOrThrow().replace($createCodeNode(), true);
        });
    }),
    opt('Divider', Minus, ['hr', 'divider', 'separator', 'rule'], 'Media', (editor) => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    }),
];

function filterOptions(query: string): SlashMenuOption[] {
    if (!query) return ALL_OPTIONS;
    const lower = query.toLowerCase();
    return ALL_OPTIONS.filter(
        (o) =>
            o.title.toLowerCase().includes(lower) ||
            o.keywords.some((k) => k.includes(lower)),
    );
}

// ─── Menu content ─────────────────────────────────────────────────────────────

interface SlashMenuContentProps {
    options: SlashMenuOption[];
    selectedIndex: number | null;
    selectOptionAndCleanUp: (option: SlashMenuOption) => void;
    setHighlightedIndex: (index: number) => void;
}

function SlashMenuContent({
    options,
    selectedIndex,
    selectOptionAndCleanUp,
    setHighlightedIndex,
}: SlashMenuContentProps) {
    const listRef = useRef<HTMLDivElement>(null);

    // Scroll the highlighted item into view when keyboard navigates
    useEffect(() => {
        if (!listRef.current || selectedIndex === null) return;
        const selected = listRef.current.querySelector('[data-highlighted="true"]') as HTMLElement | null;
        if (!selected) return;
        const itemTop = selected.getBoundingClientRect().top;
        const itemBottom = selected.getBoundingClientRect().bottom;
        const listTop = listRef.current.getBoundingClientRect().top;
        const listBottom = listRef.current.getBoundingClientRect().bottom;
        if (itemTop < listTop) {
            listRef.current.scrollTop -= listTop - itemTop;
        } else if (itemBottom > listBottom) {
            listRef.current.scrollTop += itemBottom - listBottom;
        }
    }, [selectedIndex]);

    // Group options preserving order of first appearance
    const groups = options.reduce<{ name: string; items: { option: SlashMenuOption; index: number }[] }[]>(
        (acc, option, i) => {
            let group = acc.find((g) => g.name === option.group);
            if (!group) {
                group = { name: option.group, items: [] };
                acc.push(group);
            }
            group.items.push({ option, index: i });
            return acc;
        },
        [],
    );

    if (options.length === 0) {
        return (
            <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
            </div>
        );
    }

    return (
        <div
            ref={listRef}
            role="listbox"
            className="max-h-72 overflow-x-hidden overflow-y-auto scroll-py-1 p-1"
        >
            {groups.map((group, gi) => (
                <div key={group.name} role="group">
                    {gi > 0 && <div className="bg-border -mx-1 my-1 h-px" />}
                    <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                        {group.name}
                    </div>
                    {group.items.map(({ option, index }) => {
                        const Icon = option.icon;
                        const isHighlighted = selectedIndex === index;
                        return (
                            <div
                                key={option.key}
                                role="option"
                                aria-selected={isHighlighted}
                                data-highlighted={isHighlighted ? 'true' : undefined}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none outline-none',
                                    isHighlighted
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-popover-foreground',
                                )}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectOptionAndCleanUp(option);
                                }}
                            >
                                <Icon className="size-4" />
                                {option.title}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export function SlashMenuPlugin() {
    const [editor] = useLexicalComposerContext();
    const [queryString, setQueryString] = useState<string | null>(null);

    const checkForTrigger = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
        maxLength: 20,
    });

    const options = useMemo(() => filterOptions(queryString ?? ''), [queryString]);

    const onSelectOption = useCallback(
        (
            selectedOption: SlashMenuOption,
            nodeToRemove: TextNode | null,
            closeMenu: () => void,
        ) => {
            editor.update(() => {
                if (nodeToRemove) nodeToRemove.remove();
                selectedOption.onSelect(editor);
                closeMenu();
            });
        },
        [editor],
    );

    return (
        <LexicalTypeaheadMenuPlugin<SlashMenuOption>
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForTrigger}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
            ) => {
                if (!anchorElementRef.current || options.length === 0) return null;

                return createPortal(
                    <div className="z-50 min-w-[200px] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
                        <SlashMenuContent
                            options={options}
                            selectedIndex={selectedIndex}
                            selectOptionAndCleanUp={selectOptionAndCleanUp}
                            setHighlightedIndex={setHighlightedIndex}
                        />
                    </div>,
                    anchorElementRef.current,
                );
            }}
        />
    );
}
