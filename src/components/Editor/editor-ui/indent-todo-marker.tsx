import type { SlateRenderElementProps } from '@udecode/plate';

import { cn } from '@udecode/cn';
import {
    useIndentTodoListElement,
    useIndentTodoListElementState,
} from '@udecode/plate-indent-list/react';
import { useReadOnly } from '@udecode/plate/react';
import { Checkbox } from '@mantine/core';

export const TodoMarker = ({
    element,
}: Omit<SlateRenderElementProps, 'children'>) => {
    const state = useIndentTodoListElementState({ element });
    const { checkboxProps } = useIndentTodoListElement(state);
    const readOnly = useReadOnly();

    return (
        <div contentEditable={false}>
            <Checkbox
                className=' absolute top-1 -left-6'
                readOnly={readOnly}
                onChange={(event) => checkboxProps.onCheckedChange(event.target.checked)}
                checked={checkboxProps.checked}
                onMouseDown={checkboxProps.onMouseDown}
            />
        </div>
    );
};

export const TodoLi = (props: SlateRenderElementProps) => {
    const { children, element } = props;

    return (
        <li
            className={cn(
                'list-none',
                (element.checked as boolean) && 'text-muted-foreground line-through'
            )}
        >
            {children}
        </li>
    );
};
