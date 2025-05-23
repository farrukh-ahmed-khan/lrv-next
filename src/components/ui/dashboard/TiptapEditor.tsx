"use client";
import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import {
    Editable,
    withReact,
    useSlate,
    Slate,
    RenderElementProps,
    RenderLeafProps,
} from "slate-react";
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    BaseEditor,
    Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import { Button, Icon, Toolbar } from "@/components/ui/dashboard/editorComponent/component";

// Extend types
type CustomElement = {
    type:
    | "paragraph"
    | "block-quote"
    | "bulleted-list"
    | "heading-one"
    | "heading-two"
    | "list-item"
    | "numbered-list"
    | "image";  
    children: CustomText[];
    url?: string;  
};


type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
};

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

const HOTKEYS: { [key: string]: keyof CustomText } = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const RichTextExample: React.FC = () => {
    const [value, setValue] = useState<Descendant[]>(initialValue);
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    );
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    );
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    return (
        <Slate editor={editor} initialValue={value} onChange={(newValue) => setValue(newValue)}>

            <Toolbar>
                <MarkButton format="bold" icon="format_bold" />
                <MarkButton format="italic" icon="format_italic" />
                <MarkButton format="underline" icon="format_underlined" />
                <MarkButton format="code" icon="code" />
                <BlockButton format="heading-one" icon="looks_one" />
                <BlockButton format="heading-two" icon="looks_two" />
                <BlockButton format="block-quote" icon="format_quote" />
                <BlockButton format="numbered-list" icon="format_list_numbered" />
                <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                <ImageButton />
            </Toolbar>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                spellCheck
                autoFocus
                onKeyDown={(event) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];
                            toggleMark(editor, mark);
                        }
                    }
                }}
            />
        </Slate>
    );
};

const toggleBlock = (editor: Editor, format: CustomElement["type"]) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type),
        split: true,
    });

    Transforms.setNodes<SlateElement>(editor, {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive && isList) {
        const block: CustomElement = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor: Editor, format: CustomElement["type"]) => {
    const [match] = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            n.type === format,
    });

    return !!match;
};

// const isMarkActive = (editor: Editor, format: keyof CustomText) => {
//     const marks = Editor.marks(editor);
//     return marks ? marks[format] === true : false;
// };

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor) as CustomText | null;  // Explicit type for marks

    if (marks && typeof marks[format] === 'boolean') {
        return marks[format] === true;
    }

    return false;
};




const Element: React.FC<RenderElementProps> = ({ attributes, children, element }) => {
    switch (element.type) {
        case "block-quote":
            return <blockquote {...attributes}>{children}</blockquote>;
        case "bulleted-list":
            return <ul {...attributes}>{children}</ul>;
        case "heading-one":
            return <h1 {...attributes}>{children}</h1>;
        case "heading-two":
            return <h2 {...attributes}>{children}</h2>;
        case "list-item":
            return <li {...attributes}>{children}</li>;
        case "numbered-list":
            return <ol {...attributes}>{children}</ol>;
        case "image":
            return <img {...attributes} src={element.url} alt="Uploaded Image" />;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
};

interface ButtonProps {
    format: CustomElement["type"] | keyof CustomText;
    icon: string;
}

const BlockButton: React.FC<ButtonProps> = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(editor, format as CustomElement["type"])}
            onMouseDown={(event: React.MouseEvent) => {
                event.preventDefault();
                toggleBlock(editor, format as CustomElement["type"]);
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    );
};

const MarkButton: React.FC<ButtonProps> = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format as keyof CustomText)}
            onMouseDown={(event: React.MouseEvent) => {
                event.preventDefault();
                toggleMark(editor, format as keyof CustomText);
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    );
};



const ImageButton: React.FC = () => {
    const editor = useSlate();
    const [fileInputKey, setFileInputKey] = useState(0);

    const insertImage = (url: string) => {
        const image: CustomElement = {
            type: "image", 
            children: [{ text: "" }],  
            url, 
        };
        Transforms.insertNodes(editor, image); 
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const url = reader.result as string;
                insertImage(url); 
            };
            reader.readAsDataURL(file);  
        }
    };

    return (
        <div>
            <Button onMouseDown={(e) => e.preventDefault()}>
                <Icon>image</Icon>
                <input
                    key={fileInputKey} 
                    type="file"
                    accept="image/*" 
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
            </Button>
        </div>
    );
};



const initialValue: Descendant[] = [
   
    {
        type: "paragraph",
        children: [{ text: "Try it out for yourself!" }],
    },
];

export default RichTextExample;
