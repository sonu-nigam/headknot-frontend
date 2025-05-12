import { ActionIcon } from '@mantine/core';
import { cn, withRef } from '@udecode/cn';
import {
    useToggleButton,
    useToggleButtonState,
} from '@udecode/plate-toggle/react';
import { PlateElement, useElement } from '@udecode/plate/react';
import { ChevronRight } from 'lucide-react';

export const ToggleElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        const element = useElement();
        const state = useToggleButtonState(element.id as string);
        const { buttonProps, open } = useToggleButton(state);
        console.log(element);

        return (
            <PlateElement ref={ref} className={cn(className, 'pl-6')} {...props}>
                <ActionIcon
                    size="sm"
                    variant="transparent"
                    className="absolute top-0 -left-0.5 size-6 cursor-pointer items-center justify-center rounded-md p-px text-muted-foreground transition-colors select-none hover:bg-accent [&_svg]:size-4"
                    contentEditable={false}
                    {...buttonProps}
                >
                    <ChevronRight
                        className={cn(
                            'transition-transform duration-75',
                            open ? 'rotate-90' : 'rotate-0'
                        )}
                    />
                </ActionIcon>
                {children}
            </PlateElement>
        );
    }
);
