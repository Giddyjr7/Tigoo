import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';

export default function RichTextEditor({ initialData, onChange, editorRef }) {
    const editorInstance = useRef(null);

    useEffect(() => {
        if (!editorInstance.current) {
            const editor = new EditorJS({
                holder: 'editorjs-container',
                placeholder: 'Tell your story...',
                data: initialData || {},
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: ['link'],
                        config: {
                            placeholder: 'Enter a header',
                            levels: [2, 3, 4],
                            defaultLevel: 2
                        }
                    },
                    list: {
                        class: List,
                        inlineToolbar: true
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: '', // Not implemented yet
                                byUrl: '' // We handle URL uploads through a custom fetch if needed, but EditorJS byUrl default is usually fine if we provide an endpoint, but since we don't have one, we can just let it embed. Wait, ImageTool requires an endpoint. We can use a dummy endpoint or configure it to just accept URLs and return the expected format.
                            },
                            uploader: {
                                uploadByUrl(url) {
                                    return new Promise((resolve) => {
                                        resolve({
                                            success: 1,
                                            file: {
                                                url: url,
                                            }
                                        });
                                    });
                                },
                                uploadByFile(file) {
                                     // Return a rejected promise or a dummy response
                                     return Promise.reject('File upload is not supported yet. Please paste an image URL instead.');
                                }
                            }
                        }
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                    },
                    code: CodeTool
                },
                onChange: async () => {
                    if (onChange) {
                        try {
                            const data = await editor.save();
                            onChange(data);
                        } catch (e) {
                            console.error('Error saving editor content', e);
                        }
                    }
                },
                onReady: () => {
                    editorInstance.current = editor;
                    if (editorRef) {
                        editorRef.current = editor;
                    }
                }
            });
        }

        return () => {
            if (editorInstance.current && editorInstance.current.destroy) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []); // Run once on mount

    return (
        <div id="editorjs-container" className="prose prose-lg dark:prose-invert max-w-none w-full min-h-[300px]"></div>
    );
}
