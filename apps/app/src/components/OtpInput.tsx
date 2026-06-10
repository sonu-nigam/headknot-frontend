import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';

type OtpInputProps = {
    /** Current value (controlled), up to `length` digits. */
    value: string;
    onChange: (value: string) => void;
    /** Fired when the field is completely filled (all `length` digits). */
    onComplete?: (value: string) => void;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
};

/**
 * Dependency-free segmented numeric code input. Handles typing (auto-advance),
 * backspace (move back), arrow navigation, and pasting a full code. Emits the
 * concatenated digit string via `onChange`.
 */
export function OtpInput({
    value,
    onChange,
    onComplete,
    length = 6,
    disabled = false,
    autoFocus = false,
}: OtpInputProps) {
    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const digits = Array.from({ length }, (_, i) => value[i] ?? '');

    const focusAt = (index: number) => {
        const clamped = Math.max(0, Math.min(length - 1, index));
        inputs.current[clamped]?.focus();
        inputs.current[clamped]?.select();
    };

    const setDigit = (index: number, digit: string) => {
        const next = value.split('');
        next[index] = digit;
        const joined = next.join('').slice(0, length);
        onChange(joined);
        if (joined.length === length && !joined.includes(' ') && digit !== '') {
            onComplete?.(joined);
        }
    };

    const handleChange = (index: number, raw: string) => {
        const digit = raw.replace(/\D/g, '').slice(-1);
        if (!digit) return;
        setDigit(index, digit);
        if (index < length - 1) focusAt(index + 1);
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            if (digits[index]) {
                setDigit(index, '');
            } else if (index > 0) {
                focusAt(index - 1);
                setDigit(index - 1, '');
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusAt(index - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusAt(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, length);
        if (!pasted) return;
        onChange(pasted);
        if (pasted.length === length) {
            onComplete?.(pasted);
            focusAt(length - 1);
        } else {
            focusAt(pasted.length);
        }
    };

    return (
        <div className="flex justify-center gap-2" role="group" aria-label="Verification code">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    autoFocus={autoFocus && index === 0}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    aria-label={`Digit ${index + 1}`}
                    className="h-12 w-11 rounded-lg border border-white/10 bg-white/5 text-center text-lg font-semibold text-white caret-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none disabled:opacity-50"
                />
            ))}
        </div>
    );
}
