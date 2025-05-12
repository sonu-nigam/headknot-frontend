"use client";
import { BlockquoteElement } from "@/components/Editor/editor-ui/blockquote-element";
import { FloatingToolbar } from "@/components/Editor/editor-ui/floating-toolbar";
import { HeadingElement } from "@/components/Editor/editor-ui/heading-element";
import { ParagraphElement } from "@/components/Editor/editor-ui/paragraph-element";
import { withPlaceholders } from "@/components/Editor/editor-ui/placeholder-element";
import { FloatingToolbarPlugin } from "@/components/Editor/plugins/floating-toolbar-plugin";
import { withProps } from "@udecode/cn";
// import { BasicElementsPlugin } from "@udecode/plate-basic-elements/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
    // BasicMarksPlugin,
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import {
    CreatePlateEditorOptions,
    ParagraphPlugin,
    PlateLeaf,
    usePlateEditor,
} from "@udecode/plate/react";
import { CodeLeaf } from "@/components/Editor/editor-ui/code-leaf";
import {
    CodeBlockPlugin,
    CodeLinePlugin,
    CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { CodeBlockElement } from "@/components/Editor/editor-ui/code-block-element";
import { CodeLineElement } from "@/components/Editor/editor-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/components/Editor/editor-ui/code-syntax-leaf";
import { editorPlugins } from "@/components/Editor/plugins";
import {
    EquationPlugin,
    InlineEquationPlugin,
} from "@udecode/plate-math/react";
import { EquationElement } from "@/components/Editor/editor-ui/equation-element";
import { InlineEquationElement } from "@/components/Editor/editor-ui/inline-equation-element";
import { LinkPlugin } from "@udecode/plate-link/react";
import { LinkElement } from "@/components/Editor/editor-ui/link-element";
import { ToggleElement } from "@/components/Editor/editor-ui/toggle-element";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { SlashInputElement } from '@/components/Editor/editor-ui/slash-input-element';
// import { SlashInputElement } from '@/components/Editor/editor-ui/slash-element';
import { CustomSlashElement } from '@/components/Editor/editor-ui/custom-slash-element';
import { SlashInputPlugin } from "@udecode/plate-slash-command/react"

export const viewComponents = {
    [BlockquotePlugin.key]: BlockquoteElement,
    [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
    [CodeBlockPlugin.key]: CodeBlockElement,
    [CodeLinePlugin.key]: CodeLineElement,
    [CodePlugin.key]: CodeLeaf,
    [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
    // [ColumnItemPlugin.key]: ColumnElement,
    // [ColumnPlugin.key]: ColumnGroupElement,
    [EquationPlugin.key]: EquationElement,
    // [ExcalidrawPlugin.key]: ExcalidrawElement,
    // [FilePlugin.key]: MediaFileElement,
    [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
    [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
    [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
    [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
    // [HighlightPlugin.key]: HighlightLeaf,
    // [HorizontalRulePlugin.key]: HrElement,
    // [ImagePlugin.key]: ImageElement,
    [InlineEquationPlugin.key]: InlineEquationElement,
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
    // [KbdPlugin.key]: KbdLeaf,
    [LinkPlugin.key]: LinkElement,
    // [MediaEmbedPlugin.key]: MediaEmbedElement,
    // [MentionPlugin.key]: MentionElement,
    [ParagraphPlugin.key]: ParagraphElement,
    // [PlaceholderPlugin.key]: MediaPlaceholderElement,
    [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
    [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
    // [SuggestionPlugin.key]: SuggestionLeaf,
    [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
    // [TableCellHeaderPlugin.key]: TableCellHeaderElement,
    // [TableCellPlugin.key]: TableCellElement,
    // [TablePlugin.key]: TableElement,
    // [TableRowPlugin.key]: TableRowElement,
    // [TocPlugin.key]: TocElement,
    [TogglePlugin.key]: ToggleElement,
    [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
    // [VideoPlugin.key]: MediaVideoElement,
};

export const editorComponents = {
    ...viewComponents,
    // [AIPlugin.key]: AILeaf,
    // [EmojiInputPlugin.key]: EmojiInputElement,
    // [MentionInputPlugin.key]: MentionInputElement,
    [SlashInputPlugin.key]: SlashInputElement,
};

export const useEditor = (
    {
        components,
        override,
        readOnly,
        ...options
    }: {
        components?: Record<string, any>;
        plugins?: any[];
        readOnly?: boolean;
    } & Omit<CreatePlateEditorOptions, "plugins"> = {},
    deps: any[] = [],
) => {
    return usePlateEditor(
        {
            override: {
                components: {
                    ...(readOnly
                        ? viewComponents
                        : withPlaceholders(editorComponents)),
                    ...components,
                },
                ...override,
            },
            plugins: [
                ...editorPlugins,
                // BasicElementsPlugin,
                // BasicMarksPlugin,
                FloatingToolbarPlugin,
            ],
            ...options,
        },
        deps,
    );
};
