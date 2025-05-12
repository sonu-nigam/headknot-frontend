// src/components/plate-ui/custom-slash-element.tsx
import { useComboboxInput } from '@udecode/plate-combobox/react';
import { PlateElement } from '@udecode/plate/react';
import { useRef } from 'react';

export const CustomSlashElement = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { props: inputProps } = useComboboxInput({
        ref: inputRef
    });

    return (
        <div className="slash-combobox">
            <input
                {...inputProps}
                placeholder="Type command..."
                className="slash-input"
            />
            <div className="slash-items">
                kdjlskjflk
                {/* Render your custom command items here */}
            </div>
        </div>
    );
};
