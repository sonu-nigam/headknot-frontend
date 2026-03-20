import type { EditorThemeClasses } from 'lexical';

export const MemoryEditorTheme: EditorThemeClasses = {
    heading: {
        h1: 'mt-[1.6em] pb-1 text-4xl font-bold tracking-tight',
        h2: 'mt-[1.4em] pb-px text-2xl font-semibold tracking-tight',
        h3: 'mt-[1em] pb-px text-xl font-semibold tracking-tight',
    },
    quote:
        'border-l-4 border-border pl-4 italic text-muted-foreground my-4',
    list: {
        ul: 'list-disc ml-6 my-1',
        ol: 'list-decimal ml-6 my-1',
        listitem: 'my-0.5',
        nested: {
            listitem: 'list-none',
        },
    },
    link: 'text-primary underline cursor-pointer',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
        code: 'font-mono text-sm bg-muted px-1 py-0.5 rounded',
    },
    code: 'block font-mono text-sm bg-muted rounded-md p-4 my-2 whitespace-pre overflow-x-auto',
    mark: 'bg-yellow-200/60 dark:bg-yellow-500/30 rounded-sm',
    paragraph: 'mb-2 leading-7',
    hr: 'border-none border-t border-border my-4',
};
