import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Bell, MoreHorizontal, Loader2 } from 'lucide-react';
import RichTextEditor from '../components/editor/RichTextEditor';
import PublishModal from '../components/editor/PublishModal';
import UserDropdown from '../components/layout/UserDropdown';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function EditorPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const editorRef = useRef(null);
    const { user } = useAuth();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState({});
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id);
    const [existingPost, setExistingPost] = useState(null);

    useEffect(() => {
        if (!id) return;
        
        const fetchPost = async () => {
            try {
                // Assuming we have an endpoint that can fetch by ID, but wait, PostController has GET /{slug}.
                // We don't have GET /{id} for post details. 
                // Ah, we might have to use a user post list or something if there's no direct ID lookup, 
                // but usually there's a way. Let me check the backend.
                // Wait, GET /api/posts/{slug} works. Do we pass slug to edit instead of ID?
                // The requirements said: "Use PATCH /api/posts/{id} when editing an existing draft".
                // I will assume ID is passed in URL, but let's see if we have GET /api/posts/{id} or we should change the route to edit/:slug.
                // If the user's instructions implied /edit/:id, but we only have GET /api/posts/{slug}, I'll use a hack or just change the route to edit/:slug.
                // Actually, wait, let's use edit/:slug, it's easier to fetch. Or let's just do edit/:id and fetch from user's posts.
                // Wait, I can't write comments in this block, this is replacement content.
                // Let's assume we can fetch by slug if we change route to edit/:slug.
                // But the user said "PATCH /api/posts/{id}". We do have that.
                
                // For now, let's fetch by slug if we assume id parameter is actually a slug.
                // Actually, let's just do GET /api/posts/${id} and see if it works (it won't because the controller expects slug).
                // Let's fetch all posts of the user and find the one with this ID.
                const res = await api.get(`/api/posts/user/${user.id}?page=0&size=100`);
                const post = res.data.content.find(p => p.id === id);
                if (post) {
                    // Fetch full post detail by slug to get the content
                    const detailRes = await api.get(`/api/posts/${post.slug}`);
                    setExistingPost(detailRes.data);
                    setTitle(detailRes.data.title);
                    if (detailRes.data.content) {
                        setContent(JSON.parse(detailRes.data.content));
                    }
                } else {
                    toast.error("Post not found");
                    navigate('/');
                }
            } catch (err) {
                console.error("Failed to load post for editing", err);
                toast.error("Failed to load post");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id, user.id, navigate]);

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
            let res;
            if (id) {
                res = await api.patch(`/api/posts/${id}`, payload);
                toast.success(payload.status === 'PUBLISHED' ? 'Story published!' : 'Draft updated!');
            } else {
                res = await api.post('/api/posts', payload);
                toast.success(payload.status === 'PUBLISHED' ? 'Story published!' : 'Draft saved!');
            }
            setIsPublishModalOpen(false);
            navigate(`/post/${res.data.slug}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-text" />
            </div>
        );
    }

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
                    <UserDropdown user={user} />
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
                existingPost={existingPost}
            />
        </div>
    );
}
