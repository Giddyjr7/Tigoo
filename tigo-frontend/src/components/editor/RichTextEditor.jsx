import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
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
                            // No backend upload endpoint exists yet, so file uploads are rejected
                            // and only URL-based images (handled via the custom uploader below) are supported.
                            endpoints: {
                                byFile: '',
                                byUrl: ''
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
                                uploadByFile() {
                                     return Promise.reject(new Error('File upload is not supported yet. Please paste an image URL instead.'));
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
                            toast.error('Failed to save your changes. Please try again.');
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
        <div id="editorjs-container" className="prose prose-lg max-w-none w-full min-h-[300px]"></div>
    );
}
