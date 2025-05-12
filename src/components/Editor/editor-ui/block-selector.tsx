import {
    Group,
    Combobox,
    ThemeIcon,
    useCombobox,
    ScrollArea,
    ActionIcon,
} from "@mantine/core";
import {
    IconBlockquote,
    IconChevronCompactRight,
    IconChevronRight,
    IconCode,
    IconH1,
    IconH2,
    IconH3,
    IconH4,
    IconList,
    IconListCheck,
    IconListNumbers,
    IconPilcrow,
    IconSpeakerphone,
} from "@tabler/icons-react";
import {
    ParagraphPlugin,
    useEditorRef,
    useSelectionFragmentProp,
} from "@udecode/plate/react";
import { ListCollapseIcon, SquareSigmaIcon } from "lucide-react";
import { useState } from "react";
import { getBlockType, setBlockType } from "../transforms";
import { ColumnItemPlugin, ColumnPlugin } from "@udecode/plate-layout/react";
import {
    TableCellPlugin,
    TablePlugin,
    TableRowPlugin,
} from "@udecode/plate-table/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { CodeBlockPlugin } from "@udecode/plate-code-block/react";
import { EquationPlugin } from "@udecode/plate-math/react";

const data = [
    { icon: IconPilcrow, value: ParagraphPlugin.key, label: "Text" },
    { icon: IconH1, value: HEADING_KEYS.h1, label: "Heading 1" },
    { icon: IconH2, value: HEADING_KEYS.h2, label: "Heading 2" },
    { icon: IconH3, value: HEADING_KEYS.h3, label: "Heading 3" },
    { icon: IconH4, value: HEADING_KEYS.h4, label: "Heading 4" },
    { icon: IconList, value: ListStyleType.Disc, label: "Bullet List" },
    {
        icon: IconListNumbers,
        value: ListStyleType.Decimal,
        label: "Number List",
    },
    { icon: IconListCheck, value: INDENT_LIST_KEYS.todo, label: "Check List" },
    { icon: IconChevronRight, value: TogglePlugin.key, label: "Toggle List" },
    { icon: IconBlockquote, value: BlockquotePlugin.key, label: "Blockquote" },
    { icon: IconCode, value: CodeBlockPlugin.key, label: "Block Code" },
    // { icon: IconSpeakerphone, value: "Callout", label: "Callout" },
    // { icon: SquareSigmaIcon, value: EquationPlugin.key, label: "Block equation" },
];

export function BlockItemOptions() {
    const editor = useEditorRef();
    const [search, setSearch] = useState("");
    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearch("");
        },

        onDropdownOpen: () => {
            combobox.focusSearchInput();
        },
    });

    const options = data
        .filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase().trim()),
        )
        .map((item) => {
            return (
                <Combobox.Option value={item.value} key={item.value}>
                    <Group gap={6}>
                        <ThemeIcon size="sm" variant="transparent">
                            <item.icon size={16} />
                        </ThemeIcon>
                        <span>{item.label}</span>
                    </Group>
                </Combobox.Option>
            );
        });

    const STRUCTURAL_TYPES: string[] = [
        ColumnPlugin.key,
        ColumnItemPlugin.key,
        TablePlugin.key,
        TableRowPlugin.key,
        TableCellPlugin.key,
    ];
    const value = useSelectionFragmentProp({
        defaultValue: ParagraphPlugin.key,
        structuralTypes: STRUCTURAL_TYPES,
        getProp: (node) => getBlockType(node as any),
    });
    const selectedItem = value
        ? data.find((item) => item.value === value)
        : null;

    return (
        <>
            <Combobox
                store={combobox}
                width={250}
                position="bottom-start"
                withinPortal={false}
                onOptionSubmit={(type) => {
                    setBlockType(editor, type);
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target withAriaAttributes={false}>
                    <ActionIcon
                        variant="subtle"
                        onClick={() => combobox.toggleDropdown()}
                    >
                        {selectedItem ? <selectedItem.icon size={16} /> : null}
                    </ActionIcon>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Search
                        value={search}
                        onChange={(event) =>
                            setSearch(event.currentTarget.value)
                        }
                        placeholder="Search groceries"
                    />
                    <ScrollArea.Autosize mah={200}>
                        <Combobox.Options>
                            {options.length > 0 ? (
                                options
                            ) : (
                                <Combobox.Empty>Nothing found</Combobox.Empty>
                            )}
                        </Combobox.Options>
                    </ScrollArea.Autosize>
                </Combobox.Dropdown>
            </Combobox>
        </>
    );
}
