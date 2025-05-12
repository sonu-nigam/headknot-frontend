import { Button, ColorSwatch, Divider, Flex, Group, Popover, SimpleGrid, Text } from "@mantine/core";
import { IconChevronDown, IconPalette } from "@tabler/icons-react";
import React, { useState } from "react";
import { DEFAULT_COLORS, DEFAULT_CUSTOM_COLORS } from "./color-constants";
import { FontBackgroundColorPlugin, FontColorPlugin, useColorDropdownMenu, useColorDropdownMenuState, useColorInput } from "@udecode/plate-font/react"
import { useMarkToolbarButton, useMarkToolbarButtonState } from "@udecode/plate/react";

type Props = {};

function ColorDropdownMenu({ }: Props) {
    const textColorState = useColorDropdownMenuState({
        closeOnSelect: true,
        colors: DEFAULT_COLORS,
        customColors: DEFAULT_CUSTOM_COLORS,
        nodeType: FontColorPlugin.key,
    });
    const backgroundColorState = useColorDropdownMenuState({
        closeOnSelect: true,
        colors: DEFAULT_COLORS,
        customColors: DEFAULT_CUSTOM_COLORS,
        nodeType: FontBackgroundColorPlugin.key,
    });


    const textColorButtonState = useMarkToolbarButtonState({ nodeType: FontBackgroundColorPlugin.key });
    const { props: textColorButtonProps } = useMarkToolbarButton(textColorButtonState);
    const backgroundColorButtonState = useMarkToolbarButtonState({ nodeType: FontBackgroundColorPlugin.key });
    const { props: backgroundColorButtonProps } = useMarkToolbarButton(backgroundColorButtonState);
    const colorApplied = textColorButtonProps.pressed || backgroundColorButtonProps.pressed

    console.log(backgroundColorButtonProps, backgroundColorState)

    const [opened, setOpened] = useState(false)
    const updateColor = (type: "TEXT" | "BACKGROUND", color: string) => {
        if (type === "TEXT") textColorState.updateColor(color)
        else backgroundColorState.updateColor(color)
        setOpened(false)
    }

    return (
        <Popover withinPortal={false} opened={opened}>
            <Popover.Target>
                <Button
                    px={4}
                    variant={colorApplied ? "light" : "subtle"}
                    size="compact-sm"
                    rightSection={<IconChevronDown size={16} stroke={2} />}
                    classNames={{
                        section: "ml-[4px]",
                    }}
                    onClick={() => setOpened(true)}
                >
                    <IconPalette size={16} />
                </Button>
            </Popover.Target>
            <Popover.Dropdown p={6}>
                <Flex justify="space-between" align="center" mb="xs">
                    <Text c="dimmed" size="sm" fw={600}>
                        Text Color
                    </Text>
                    <Button size="compact-xs" variant="subtle" color="red" onClick={textColorState.clearColor}>Clear</Button>
                </Flex>
                <SimpleGrid cols={5} mb="lg" spacing="xs" verticalSpacing="xs">
                    {DEFAULT_COLORS.map((color, idx) => (
                        <ColorSwatch
                            color={color.isBrightColor ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"}
                            component="button"
                            radius={4}
                            key={idx}
                            onClick={() => updateColor("TEXT", color.value)}
                        >
                            <Text c={color.value}>A</Text>
                        </ColorSwatch>
                    ))}
                </SimpleGrid>
                <Divider mb="xs" />
                <Flex justify="space-between" align="center" mb="xs">
                    <Text c="dimmed" size="sm" fw={600}>
                        Background Color
                    </Text>
                    <Button size="compact-xs" variant="subtle" color="red" onClick={backgroundColorState.clearColor}>Clear</Button>
                </Flex>
                <SimpleGrid cols={5} spacing="xs" verticalSpacing="xs">
                    {DEFAULT_COLORS.map((color, idx) => (
                        <ColorSwatch
                            component="button"
                            color={color.value}
                            radius={4}
                            key={idx}
                            onClick={() => updateColor("BACKGROUND", color.value)}
                        >
                            <Text c={color.isBrightColor ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)"}>A</Text>
                        </ColorSwatch>
                    ))}
                </SimpleGrid>
            </Popover.Dropdown>
        </Popover>
    );
}

export default ColorDropdownMenu;
