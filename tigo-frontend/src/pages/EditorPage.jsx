import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/editor/RichTextEditor';
import PublishModal from '../components/editor/PublishModal';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function EditorPage() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState({});
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleEditorChange = (data) => {
        setContent(data);
    };

    const handlePublishClick = async () => {
        if (!title.trim()) {
            toast.error("Please enter a title before publishing.");
            return;
        }
        
        let currentContent = content;
        if (editorRef.current) {
            try {
                currentContent = await editorRef.current.save();
                setContent(currentContent);
            } catch (e) {
                console.error("Failed to get editor data on publish:", e);
            }
        }

        if (!currentContent.blocks || currentContent.blocks.length === 0) {
             toast.error("Story content cannot be empty.");
             return;
        }

        setIsPublishModalOpen(true);
    };

    const handleSavePost = async (payload) => {
        setIsSaving(true);
        try {
            const res = await api.post('/api/posts', payload);
            toast.success(payload.status === 'PUBLISHED' ? 'Story published!' : 'Draft saved!');
            setIsPublishModalOpen(false);
            navigate(`/post/${res.data.slug}`);
        } catch (err) {
            throw err; // Let the modal handle the error display
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full pt-10 pb-32">
            <div className="flex justify-between items-center mb-10 border-b border-border pb-4">
                <h1 className="text-sm font-medium text-text-muted tracking-wider uppercase">Draft</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-text-muted">
                        {content.blocks?.length > 0 ? 'Changes saved locally' : 'Autosaving...'}
                    </span>
                    <button 
                        onClick={handlePublishClick}
                        className="bg-accent text-white px-5 py-2 rounded-full font-medium hover:bg-accent-hover transition-colors"
                    >
                        Publish
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full text-5xl font-bold bg-transparent border-none outline-none text-text-h placeholder:text-text-muted/40"
                    autoFocus
                />
            </div>

            <RichTextEditor 
                initialData={content} 
                onChange={handleEditorChange} 
                editorRef={editorRef}
            />

            <PublishModal 
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                postData={{ title, content }}
                isSaving={isSaving}
                onSave={handleSavePost}
            />
        </div>
    );
}
