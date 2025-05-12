"use client";

import React, { useState } from "react";

import type { TCodeBlockElement } from "@udecode/plate-code-block";

import { cn } from "@udecode/cn";
import { useEditorRef, useElement, useReadOnly } from "@udecode/plate/react";
import {
    ActionIcon,
    Button,
    Combobox,
    Group,
    ScrollArea,
    ThemeIcon,
    useCombobox,
} from "@mantine/core";

const languages: { id: number; label: string; value: string }[] = [
    { id: 1, label: "Auto", value: "auto" },
    { id: 2, label: "Plain Text", value: "plaintext" },
    { id: 3, label: "ABAP", value: "abap" },
    { id: 4, label: "Agda", value: "agda" },
    { id: 5, label: "Arduino", value: "arduino" },
    { id: 6, label: "ASCII Art", value: "ascii" },
    { id: 7, label: "Assembly", value: "x86asm" },
    { id: 8, label: "Bash", value: "bash" },
    { id: 9, label: "BASIC", value: "basic" },
    { id: 10, label: "BNF", value: "bnf" },
    { id: 11, label: "C", value: "c" },
    { id: 12, label: "C#", value: "csharp" },
    { id: 13, label: "C++", value: "cpp" },
    { id: 14, label: "Clojure", value: "clojure" },
    { id: 15, label: "CoffeeScript", value: "coffeescript" },
    { id: 16, label: "Coq", value: "coq" },
    { id: 17, label: "CSS", value: "css" },
    { id: 18, label: "Dart", value: "dart" },
    { id: 19, label: "Dhall", value: "dhall" },
    { id: 20, label: "Diff", value: "diff" },
    { id: 21, label: "Docker", value: "dockerfile" },
    { id: 22, label: "EBNF", value: "ebnf" },
    { id: 23, label: "Elixir", value: "elixir" },
    { id: 24, label: "Elm", value: "elm" },
    { id: 25, label: "Erlang", value: "erlang" },
    { id: 26, label: "F#", value: "fsharp" },
    { id: 27, label: "Flow", value: "flow" },
    { id: 28, label: "Fortran", value: "fortran" },
    { id: 29, label: "Gherkin", value: "gherkin" },
    { id: 30, label: "GLSL", value: "glsl" },
    { id: 31, label: "Go", value: "go" },
    { id: 32, label: "GraphQL", value: "graphql" },
    { id: 33, label: "Groovy", value: "groovy" },
    { id: 34, label: "Haskell", value: "haskell" },
    { id: 35, label: "HCL", value: "hcl" },
    { id: 36, label: "HTML", value: "html" },
    { id: 37, label: "Idris", value: "idris" },
    { id: 38, label: "Java", value: "java" },
    { id: 39, label: "JavaScript", value: "javascript" },
    { id: 40, label: "JSON", value: "json" },
    { id: 41, label: "Julia", value: "julia" },
    { id: 42, label: "Kotlin", value: "kotlin" },
    { id: 43, label: "LaTeX", value: "latex" },
    { id: 44, label: "Less", value: "less" },
    { id: 45, label: "Lisp", value: "lisp" },
    { id: 46, label: "LiveScript", value: "livescript" },
    { id: 47, label: "LLVM IR", value: "llvm" },
    { id: 48, label: "Lua", value: "lua" },
    { id: 49, label: "Makefile", value: "makefile" },
    { id: 50, label: "Markdown", value: "markdown" },
    { id: 51, label: "Markup", value: "markup" },
    { id: 52, label: "MATLAB", value: "matlab" },
    { id: 53, label: "Mathematica", value: "mathematica" },
    { id: 54, label: "Mermaid", value: "mermaid" },
    { id: 55, label: "Nix", value: "nix" },
    { id: 56, label: "Notion Formula", value: "notion" },
    { id: 57, label: "Objective-C", value: "objectivec" },
    { id: 58, label: "OCaml", value: "ocaml" },
    { id: 59, label: "Pascal", value: "pascal" },
    { id: 60, label: "Perl", value: "perl" },
    { id: 61, label: "PHP", value: "php" },
    { id: 62, label: "PowerShell", value: "powershell" },
    { id: 63, label: "Prolog", value: "prolog" },
    { id: 64, label: "Protocol Buffers", value: "protobuf" },
    { id: 65, label: "PureScript", value: "purescript" },
    { id: 66, label: "Python", value: "python" },
    { id: 67, label: "R", value: "r" },
    { id: 68, label: "Racket", value: "racket" },
    { id: 69, label: "Reason", value: "reasonml" },
    { id: 70, label: "Ruby", value: "ruby" },
    { id: 71, label: "Rust", value: "rust" },
    { id: 72, label: "Sass", value: "scss" },
    { id: 73, label: "Scala", value: "scala" },
    { id: 74, label: "Scheme", value: "scheme" },
    { id: 75, label: "SCSS", value: "scss" },
    { id: 76, label: "Shell", value: "shell" },
    { id: 77, label: "Smalltalk", value: "smalltalk" },
    { id: 78, label: "Solidity", value: "solidity" },
    { id: 79, label: "SQL", value: "sql" },
    { id: 80, label: "Swift", value: "swift" },
    { id: 81, label: "TOML", value: "toml" },
    { id: 82, label: "TypeScript", value: "typescript" },
    { id: 83, label: "VB.Net", value: "vbnet" },
    { id: 84, label: "Verilog", value: "verilog" },
    { id: 85, label: "VHDL", value: "vhdl" },
    { id: 86, label: "Visual Basic", value: "vbnet" },
    { id: 87, label: "WebAssembly", value: "wasm" },
    { id: 88, label: "XML", value: "xml" },
    { id: 89, label: "YAML", value: "yaml" },
];

export function CodeBlockCombobox() {
    const readOnly = useReadOnly();
    const editor = useEditorRef();
    const element = useElement<TCodeBlockElement>();
    const value = element.lang || "plaintext";
    const [searchValue, setSearchValue] = React.useState("");

    const items = React.useMemo(
        () =>
            languages.filter(
                (language) =>
                    !searchValue ||
                    language.label
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()),
            ),
        [searchValue],
    );

    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearchValue("");
        },

        onDropdownOpen: () => {
            combobox.focusSearchInput();
        },
    });

    const options = languages
        .filter((item) =>
            item.label.toLowerCase().includes(searchValue.toLowerCase().trim()),
        )
        .map((item) => {
            return (
                <Combobox.Option value={item.value} key={item.id}>
                    <Group gap={6}>
                        <span>{item.label}</span>
                    </Group>
                </Combobox.Option>
            );
        });

    if (readOnly) return null;

    return (
        <>
            <Combobox
                store={combobox}
                width={250}
                position="bottom-end"
                onOptionSubmit={(value) => {
                    editor.tf.setNodes<TCodeBlockElement>(
                        { lang: value },
                        { at: element },
                    );
                    setSearchValue(value);
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target withAriaAttributes={false}>
                    <Button
                        variant="subtle"
                        size="compact-sm"
                        fw={400}
                        color="gray"
                        onClick={() => combobox.toggleDropdown()}
                    >
                        {languages.find((language) => language.value === value)
                            ?.label ?? "Plain Text"}
                    </Button>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Search
                        value={searchValue}
                        onChange={(event) =>
                            setSearchValue(event.currentTarget.value)
                        }
                        placeholder="Search groceries"
                    />
                    <ScrollArea.Autosize mah={200}>
                        <Combobox.Options>
                            {options.length > 0 ? (
                                options
                            ) : (
                                <Combobox.Empty>Nothing found</Combobox.Empty>
                            )}
                        </Combobox.Options>
                    </ScrollArea.Autosize>
                </Combobox.Dropdown>
            </Combobox>
        </>
    );
}
