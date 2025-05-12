import { ActionIcon, Button, Group, Popover, ThemeIcon } from "@mantine/core";
import {
    IconAlignCenter,
    IconAlignJustified,
    IconAlignLeft,
    IconAlignRight,
    IconChevronDown,
    IconIndentDecrease,
    IconIndentIncrease,
} from "@tabler/icons-react";
import { withRef } from "@udecode/cn";
import {
    useEditorRef,
    useMarkToolbarButton,
    useMarkToolbarButtonState,
    useSelectionFragmentProp,
} from "@udecode/plate/react";
import { Alignment, setAlign } from "@udecode/plate-alignment";
import { STRUCTURAL_TYPES } from "../transforms";

export function AlignDropdown() {
    return (
        <Popover withinPortal={false}>
            <Popover.Target>
                <Button
                    size="compact-sm"
                    px={0}
                    classNames={{
                        section: "ml-0",
                    }}
                    variant="subtle"
                    rightSection={<IconChevronDown size={16} stroke={1.5} />}
                >
                    <ThemeIcon variant="subtle" className="rounded-e-none">
                        <IconAlignLeft size={16} stroke={2} />
                    </ThemeIcon>
                </Button>
            </Popover.Target>
            <Popover.Dropdown p={6}>
                <Group gap={4}>
                    <MenuItem actionType="start">
                        <IconAlignLeft size={16} stroke={2} />
                    </MenuItem>
                    <MenuItem actionType="center">
                        <IconAlignCenter size={16} stroke={2} />
                    </MenuItem>
                    <MenuItem actionType="right">
                        <IconAlignRight size={16} stroke={2} />
                    </MenuItem>
                    <MenuItem actionType="justify">
                        <IconAlignJustified size={16} stroke={2} />
                    </MenuItem>
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
}

const MenuItem = withRef<
    typeof ActionIcon,
    {
        actionType: Alignment;
        children: React.ReactNode;
    }
>(({ actionType, ...rest }, ref) => {
    const editor = useEditorRef();
    const value = useSelectionFragmentProp({
        defaultValue: "start",
        structuralTypes: STRUCTURAL_TYPES,
        getProp: (node) => node.align,
    });

    const isActive = actionType === value;

    return (
        <ActionIcon
            ref={ref}
            variant={isActive ? "light" : "subtle"}
            onClick={() => {
                setAlign(editor, { value: actionType });
                editor.tf.focus();
            }}
            {...rest}
        />
    );
});
