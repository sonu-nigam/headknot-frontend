import {
    Box,
    Button,
    Divider,
    ScrollArea,
    Text,
    UnstyledButton,
} from "@mantine/core";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Command, MenuListProps } from "./types";

type GroupedCommand = Command & {
    groupName?: string; // Optional property to be added
    groupTitle?: string; // Optional property to be added
};

interface Group {
    name: string;
    title: string;
    commands: Command[];
}

function flattenCommands(input: Group[]): GroupedCommand[] {
    if (!input) return [];
    return input.reduce<GroupedCommand[]>((acc, cur: Group) => {
        const { name: groupName, title: groupTitle, commands } = cur;

        const flatCommands: GroupedCommand[] = commands.map((command) => ({
            ...command,
            groupName,
            groupTitle,
        }));

        return acc.concat(...flatCommands);
    }, []);
}

export const SlashMenu = forwardRef((props: MenuListProps, ref) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(-1);
    const flatItems = flattenCommands(props.items);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                event.stopPropagation();
                if (!flatItems?.length) return false;

                setHovered((current) => {
                    const nextIndex =
                        current + 1 >= flatItems.length ? 0 : current + 1;
                    if (nextIndex === 0) {
                        viewportRef.current!.scrollTo({
                            top: 0,
                        });
                    } else {
                        viewportRef.current
                            ?.querySelectorAll("[data-list-item]")
                            ?.[nextIndex]?.scrollIntoView({ block: "nearest" });
                    }
                    return nextIndex;
                });
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                if (!flatItems?.length) return false;

                setHovered((current) => {
                    const nextIndex =
                        current - 1 < 0 ? flatItems.length - 1 : current - 1;
                    if (nextIndex === 0) {
                        viewportRef.current!.scrollTo({
                            top: 0,
                        });
                    } else if (nextIndex === flatItems.length - 1) {
                        viewportRef.current!.scrollTo({
                            top: viewportRef.current!.scrollHeight,
                        });
                    } else {
                        viewportRef.current
                            ?.querySelectorAll("[data-list-item]")
                            ?.[nextIndex]?.scrollIntoView({ block: "nearest" });
                    }
                    return nextIndex;
                });
            }

            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                if (!flatItems?.length || hovered < 0) {
                    return false;
                }

                props.command(flatItems[hovered]);

                return true;
            }

            return false;
        },
    }));

    if (!flatItems?.length) return null;

    return (
        <ScrollArea.Autosize
            mah={250}
            viewportRef={viewportRef}
            w={250}
            p="calc(.25rem* var(--mantine-scale))"
            bg="var(--mantine-color-white)"
            style={{
                boxShadow: "var(--mantine-shadow-md, none)",
                borderRadius:
                    "var(--popover-radius, var(--mantine-radius-default))",
                border: "1px solid var(--mantine-color-gray-2)",
                backfaceVisibility: "hidden",
            }}
        >
            {flatItems?.map((item, idx: number) => {
                const Icon = item.icon;
                return (
                    <React.Fragment
                        key={`${item.groupTitle}-${item.name}-wrapper`}
                    >
                        {flatItems[idx - 1]?.groupName !== item?.groupName && (
                            <>
                                {idx != 0 && (
                                    <Divider my="calc(.25rem* var(--mantine-scale))" />
                                )}
                                <Text
                                    c="dimmed"
                                    fw={500}
                                    fz="var(--mantine-font-size-xs)"
                                    p="calc(var(--mantine-spacing-xs) / 2) calc(0.75rem* var(--mantine-scale))"
                                    style={{ cursor: "default" }}
                                >
                                    {item.groupTitle}
                                </Text>
                            </>
                        )}
                        <Button
                            data-list-item
                            fullWidth
                            size="sm"
                            variant="subtle"
                            className={idx === hovered ? "active" : undefined}
                            bg={
                                idx === hovered
                                    ? "var(--button-hover)"
                                    : undefined
                            }
                            color="dark"
                            justify="start"
                            fw={500}
                            leftSection={
                                Icon && <Icon size={16} stroke={1.5} />
                            }
                        >
                            {item.label}
                        </Button>
                    </React.Fragment>
                );
            })}
        </ScrollArea.Autosize>
    );
});

SlashMenu.displayName = "MenuList";

export default SlashMenu;
