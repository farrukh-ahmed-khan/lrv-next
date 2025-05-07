'use client';

import React, {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Delta from 'quill-delta';






type EditorProps = {
    readOnly?: boolean;
    defaultValue?: string | Delta;
    onTextChange?: (delta: any, oldDelta: any, source: string) => void;
    onSelectionChange?: (range: any, oldRange: any, source: string) => void;
};


const Editor = forwardRef<Quill | null, EditorProps>(
    ({ readOnly = false, defaultValue, onTextChange, onSelectionChange }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        useEffect(() => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const editorContainer = container.ownerDocument.createElement('div');
            container.appendChild(editorContainer);

            const quill = new Quill(editorContainer, {
                theme: 'snow',
                // modules: {
                //     toolbar: [
                //         [{ header: [1, 2, false] }],
                //         ['bold', 'italic', 'underline'],
                //         ['image', 'code-block'],
                //     ],
                // },

                modules: {
                    toolbar: {
                        container: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'link'],
                            ['image', 'code-block'],
                            // ['custom-button'], 
                        ],
                        // handlers: {
                        //     'custom-button': function (this: Quill) {
                        //         const url = prompt('Enter button URL:');
                        //         if (url) {
                        //             const range = this.getSelection();
                        //             if (range) {
                        //                 this.insertEmbed(range.index, 'buttonLink', url, 'user');
                        //             }
                        //         }
                        //     },
                        // },
                    },
                }

            });

            if (typeof ref === 'function') {
                ref(quill);
            } else if (ref && typeof ref === 'object') {
                (ref as React.MutableRefObject<Quill | null>).current = quill;
            }



            if (defaultValueRef.current) {
                if (typeof defaultValueRef.current === 'string') {
                    const delta = quill.clipboard.convert({ html: defaultValueRef.current }); // ✅ FIXED
                    quill.setContents(delta, 'silent');
                } else if (defaultValueRef.current?.ops) {
                    quill.setContents(defaultValueRef.current, 'silent'); // it's a Delta object
                }
            }


            // if (defaultValueRef.current) {
            //     quill.setContents(defaultValueRef.current);
            // }

            quill.on('text-change', (...args) => {
                onTextChangeRef.current?.(...args);
            });

            quill.on('selection-change', (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            return () => {
                if (typeof ref === 'object' && ref) {
                    (ref as React.MutableRefObject<Quill | null>).current = null;
                }
                container.innerHTML = '';
            };
        }, [ref]);

        useEffect(() => {
            if (ref && typeof ref === 'object' && ref.current) {
                ref.current.enable(!readOnly);
            }
        }, [ref, readOnly]);

        return <div ref={containerRef}></div>;
    }
);

Editor.displayName = 'Editor';
export default Editor;
