import {
    ActionIcon,
    Autocomplete,
    Box,
    Button,
    Combobox,
    ComboboxItem,
    ComboboxLikeProps,
    ComboboxLikeRenderOptionInput,
    defaultOptionsFilter,
    Divider,
    getParsedComboboxData,
    isOptionsGroup,
    Menu,
    OptionsFilter,
    Select,
    Text,
    useCombobox,
} from "@mantine/core";
import {
    Icon,
    IconBold,
    IconCode,
    IconDots,
    IconH2,
    IconH3,
    IconH4,
    IconHeading,
    IconItalic,
    IconLink,
    IconList,
    IconListCheck,
    IconListNumbers,
    IconPilcrow,
    IconProps,
    IconSettings,
    IconSourceCode,
    IconStrikethrough,
    IconUnderline,
} from "@tabler/icons-react";
import { Editor, useCurrentEditor } from "@tiptap/react";
import React, {
    ForwardRefExoticComponent,
    ReactNode,
    RefAttributes,
    useCallback,
    useMemo,
    useState,
} from "react";

type Props = {
    editor: Editor;
};

function Toolbar({ editor }: Props) {
    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();

            return;
        }

        // update link
        try {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        } catch (e: any) {
            alert(e.message);
        }
    }, [editor]);

    return (
        <Box
            style={{
                zIndex: 1,
                position: "fixed",
                bottom: 40,
                padding: 6,
                width: "100%",
                maxWidth: 680,
            }}
        >
            <Box
                bg="gray.1"
                px="lg"
                py={4}
                style={{
                    gap: 2,
                    borderRadius: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "fit-content",
                }}
            >
                <Button variant="light">AI Tools</Button>
                <Divider orientation="vertical" mx={1} />
                <Select
                    variant="filled"
                    searchable
                    defaultValue="Heading 2"
                    data={[
                        {
                            group: "Hierarchy",
                            items: [
                                "Heading 2",
                                "Heading 3",
                                "Heading 4",
                                "Paragraph",
                            ],
                        },
                        {
                            group: "List",
                            items: [
                                "Bullet List",
                                "Numbered List",
                                "Todo List",
                            ],
                        },
                    ]}
                />
                <Divider orientation="vertical" mx={1} />
                <ToolbarIcon
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    icon={IconBold}
                />
                <ToolbarIcon
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("italic")}
                    icon={IconItalic}
                />
                <ToolbarIcon
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    active={editor.isActive("underline")}
                    icon={IconUnderline}
                />
                <ToolbarIcon
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive("strike")}
                    icon={IconStrikethrough}
                />
                <ToolbarIcon
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive("code")}
                    icon={IconCode}
                />
                <ToolbarIcon
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    active={editor.isActive("codeBlock")}
                    icon={IconSourceCode}
                />
                <ToolbarIcon
                    onClick={setLink}
                    active={editor.isActive("link")}
                    icon={IconLink}
                />
                <ActionIcon variant="subtle">
                    <IconDots />
                </ActionIcon>
            </Box>
        </Box>
    );
}

export default Toolbar;

function ToolbarIcon({
    onClick,
    active,
    icon,
}: {
    onClick: () => void;
    active: boolean;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}) {
    const Icon = icon;
    return (
        <ActionIcon
            size="lg"
            onClick={onClick}
            variant={active ? "light" : "subtle"}
        >
            <Icon stroke={1.5} size={20} />
        </ActionIcon>
    );
}

export interface OptionsGroup {
    group: string;
    items: ComboboxItem[];
}

export type OptionsData = (ComboboxItem | OptionsGroup)[];

interface OptionProps {
    data: ComboboxItem | OptionsGroup;
    value?: string | string[] | null;
    renderOption?: (
        input: ComboboxLikeRenderOptionInput<any>,
    ) => React.ReactNode;
}

function isValueChecked(
    value: string | string[] | undefined | null,
    optionValue: string,
) {
    return Array.isArray(value)
        ? value.includes(optionValue)
        : value === optionValue;
}

function Option({ data, value, renderOption }: OptionProps) {
    if (!isOptionsGroup(data)) {
        const checked = isValueChecked(value, data.value);

        const defaultContent = (
            <>
                <span>{data.label}</span>
            </>
        );

        return (
            <Combobox.Option
                value={data.value}
                disabled={data.disabled}
                data-checked={checked || undefined}
                aria-selected={checked}
                active={checked}
            >
                {typeof renderOption === "function"
                    ? renderOption({ option: data, checked })
                    : defaultContent}
            </Combobox.Option>
        );
    }

    const options = data.items.map((item) => (
        <Option
            data={item}
            value={value}
            key={item.value}
            renderOption={renderOption}
        />
    ));

    return <Combobox.Group label={data.group}>{options}</Combobox.Group>;
}

function BlockMenu({ data, filter }: any) {
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
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

    const parsedData = getParsedComboboxData(data);

    const shouldFilter = true;
    const filteredData = shouldFilter
        ? (filter || defaultOptionsFilter)({
              options: parsedData,
              search,
              limit: Infinity,
          })
        : data;

    const options = filteredData.map((item: any) => (
        <Option
            data={item}
            key={isOptionsGroup(item) ? item.group : item.value}
            value={selectedItem}
        />
    ));
    return (
        <Combobox
            store={combobox}
            width={250}
            position="bottom-start"
            withArrow
            onOptionSubmit={(val) => {
                setSelectedItem(val);
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target withAriaAttributes={false}>
                <Button
                    variant="subtle"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {selectedItem}
                </Button>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search groceries"
                />
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
