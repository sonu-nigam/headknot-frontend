import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

// ─── Option definitions ───────────────────────────────────────────────────────

export type BlockInsertType =
    | 'paragraph'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'bullet'
    | 'numbered'
    | 'quote'
    | 'code'
    | 'divider';

interface MenuOption {
    title: string;
    icon: LucideIcon;
    group: string;
    type: BlockInsertType;
}

const MENU_OPTIONS: MenuOption[] = [
    { title: 'Text',          icon: Text,        group: 'Basic', type: 'paragraph' },
    { title: 'Heading 1',     icon: Heading1,    group: 'Basic', type: 'h1'        },
    { title: 'Heading 2',     icon: Heading2,    group: 'Basic', type: 'h2'        },
    { title: 'Heading 3',     icon: Heading3,    group: 'Basic', type: 'h3'        },
    { title: 'Bullet List',   icon: List,        group: 'List',  type: 'bullet'    },
    { title: 'Numbered List', icon: ListOrdered, group: 'List',  type: 'numbered'  },
    { title: 'Quote',         icon: Quote,       group: 'Media', type: 'quote'     },
    { title: 'Code Block',    icon: Code,        group: 'Media', type: 'code'      },
    { title: 'Divider',       icon: Minus,       group: 'Media', type: 'divider'   },
];

// Group options preserving order of first appearance
function groupOptions(options: MenuOption[]) {
    return options.reduce<{ name: string; items: MenuOption[] }[]>((acc, option) => {
        let group = acc.find((g) => g.name === option.group);
        if (!group) {
            group = { name: option.group, items: [] };
            acc.push(group);
        }
        group.items.push(option);
        return acc;
    }, []);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface BlockInsertMenuProps {
    /** Viewport-relative rect of the anchor element (the "+" button). */
    anchorRect: DOMRect;
    onSelect: (type: BlockInsertType) => void;
    onClose: () => void;
}

export function BlockInsertMenu({ anchorRect, onSelect, onClose }: BlockInsertMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        // Use capture so we get the event before anything else
        document.addEventListener('mousedown', handler, true);
        return () => document.removeEventListener('mousedown', handler, true);
    }, [onClose]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Position: prefer below the button; if too close to the bottom, open upward
    const menuHeight = 320; // approximate max height
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const openUpward = spaceBelow < menuHeight && anchorRect.top > menuHeight;

    const style: React.CSSProperties = {
        position: 'fixed',
        left: Math.min(anchorRect.left, window.innerWidth - 220),
        ...(openUpward
            ? { bottom: window.innerHeight - anchorRect.top + 4 }
            : { top: anchorRect.bottom + 4 }),
        zIndex: 50,
    };

    const groups = groupOptions(MENU_OPTIONS);

    return createPortal(
        <div
            ref={menuRef}
            style={style}
            className="min-w-[200px] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
            <div
                role="listbox"
                className="max-h-72 overflow-y-auto scroll-py-1 p-1"
            >
                {groups.map((group, gi) => (
                    <div key={group.name} role="group">
                        {gi > 0 && <div className="bg-border -mx-1 my-1 h-px" />}
                        <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                            {group.name}
                        </div>
                        {group.items.map((option) => {
                            const Icon = option.icon;
                            return (
                                <div
                                    key={option.type}
                                    role="option"
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none outline-none',
                                        'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
                                    )}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onSelect(option.type);
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
        </div>,
        document.body,
    );
}
