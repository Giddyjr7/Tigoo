import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ThumbsUp, Bookmark, MoreHorizontal, ThumbsDown, Edit, Trash2, Flag, EyeOff, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useClaps } from '../../hooks/useClaps';
import { api } from '../../lib/api';

export default function GridPostCard({ post, onHide, onUnsave, onDelete }) {
    const { user } = useAuth();
    const { totalClaps, userClaps, handleClap } = useClaps(post?.id, post?.clapCount || 0);
    const [isSaved, setIsSaved] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const isOwner = user && post?.author?.id === user.id;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleHide = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/posts/${post.id}/hide`);
            if (onHide) onHide();
            toast.success('Post hidden');
        } catch (err) {
            toast.error('Failed to hide post');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isSaved) {
                await api.delete(`/api/posts/${post.id}/save`);
                setIsSaved(false);
                if (onUnsave) onUnsave();
                toast.success('Removed from saved list');
            } else {
                await api.post(`/api/posts/${post.id}/save`);
                setIsSaved(true);
                toast.success('Saved to library');
            }
        } catch (err) {
            toast.error('Failed to update save status');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${post.id}`);
            if (onDelete) onDelete();
            toast.success('Post deleted');
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    if (!post) return null;
    
    return (
        <article className="flex flex-col gap-4 group">
            {post.coverImageUrl && (
                <Link to={`/post/${post.slug}`} className="w-full aspect-video overflow-hidden rounded-md bg-social-bg block">
                    <img 
                        src={post.coverImageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
            )}
            
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Link to={`/profile/${post.author?.id}`}>
                        <img 
                            src={post.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                            alt={post.author?.displayName}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                    </Link>
                    <Link to={`/profile/${post.author?.id}`} className="text-sm font-medium text-text-h hover:underline">
                        {post.author?.displayName}
                    </Link>
                </div>
                
                <Link to={`/post/${post.slug}`}>
                    <h3 className="text-[22px] font-bold text-text-h leading-tight mb-2 font-serif group-hover:underline decoration-1 underline-offset-2 line-clamp-3">
                        {post.title}
                    </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between text-text text-sm pt-4 relative">
                    <div className="flex items-center gap-4">
                        <span>{post.readTimeMin} min read</span>
                        <span onClick={(e) => { e.preventDefault(); handleClap(); }} className="flex items-center gap-1 cursor-pointer hover:text-text-h transition-colors">
                            <ThumbsUp size={16} className={userClaps > 0 ? "text-text-h" : ""} fill={userClaps > 0 ? "currentColor" : "none"} /> {totalClaps}
                        </span>
                        <span className="flex items-center gap-1" onClick={(e) => { e.preventDefault(); toast('Comments are coming soon!', { icon: '🚧' }); }}><MessageCircle size={16} className="cursor-pointer" /> 0</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="hover:text-text-h transition-colors" title="Bookmark"><Bookmark size={20} strokeWidth={1.5} className={isSaved ? "text-text-h" : ""} fill={isSaved ? "currentColor" : "none"} /></button>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={(e) => { e.preventDefault(); setShowDropdown(!showDropdown); }} className="hover:text-text-h transition-colors focus:outline-none" title="More"><MoreHorizontal size={20} strokeWidth={1.5} /></button>
                            {showDropdown && (
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-border rounded-md shadow-lg py-1 z-10 flex flex-col overflow-hidden text-sm">
                                    {isOwner ? (
                                        <>
                                            <button onClick={(e) => { e.preventDefault(); toast('Edit coming soon!'); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full">
                                                <Edit size={16} /> Edit Post
                                            </button>
                                            <button onClick={(e) => { e.preventDefault(); handleDelete(); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full text-red-600">
                                                <Trash2 size={16} /> Delete Post
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={(e) => { e.preventDefault(); toast('Reported!'); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full">
                                                <Flag size={16} /> Report Post
                                            </button>
                                            <button onClick={(e) => { e.preventDefault(); handleHide(e); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full">
                                                <EyeOff size={16} /> Not Interested
                                            </button>
                                            <button onClick={(e) => { e.preventDefault(); toast('Author muted!'); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full text-red-600">
                                                <UserX size={16} /> Mute Author
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
