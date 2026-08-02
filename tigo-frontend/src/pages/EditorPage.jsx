import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, MoreHorizontal } from 'lucide-react';
import RichTextEditor from '../components/editor/RichTextEditor';
import PublishModal from '../components/editor/PublishModal';
import UserDropdown from '../components/layout/UserDropdown';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { MOCK_USERS } from '../mocks/mockData';

export default function EditorPage() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const { user } = useAuth();
    const displayUser = user || MOCK_USERS[0];
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
        <div className="min-h-screen w-full flex flex-col bg-white">
            <nav className="flex justify-between items-center py-2 px-6 h-[65px]">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-[32px] font-bold font-serif text-[#242424] tracking-tighter mr-2">
                        TIGO
                    </Link>
                    <span className="text-[13px] text-[#242424]">Draft</span>
                    <span className="text-[13px] text-[#6B6B6B]">
                        {content.blocks?.length > 0 ? 'Saved' : ''}
                    </span>
                </div>
                
                <div className="flex items-center gap-5">
                    <button 
                        onClick={handlePublishClick}
                        className="bg-[#1A8917] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#156d12] transition-colors"
                    >
                        Publish
                    </button>
                    <button className="text-text hover:text-text-h transition-colors">
                        <MoreHorizontal size={24} strokeWidth={1.5} />
                    </button>
                    <button className="text-text hover:text-text-h transition-colors">
                        <Bell size={24} strokeWidth={1.5} />
                    </button>
                    <UserDropdown user={displayUser} />
                </div>
            </nav>

            <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-12 pb-32">
                <div className="mb-4">
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full text-[42px] font-bold font-serif bg-transparent border-none outline-none text-[#242424] placeholder:text-[#b3b3b1] leading-tight"
                        autoFocus
                    />
                </div>

                <div className="w-full">
                    <RichTextEditor 
                        initialData={content} 
                        onChange={handleEditorChange} 
                        editorRef={editorRef}
                    />
                </div>
            </main>

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
