import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp, Bookmark, MoreHorizontal, ThumbsDown, Edit, Trash2, Flag, EyeOff, UserX } from 'lucide-react';
import { useClaps } from '../../hooks/useClaps';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function PostCard({ post, onHide, onUnsave, onDelete }) {
    const { totalClaps, handleClap } = useClaps(post.id, post.clapCount || 0);
    const { user } = useAuth();
    
    // We don't have isSaved from the backend in the summary DTO yet, so we'll just track it locally for optimistic UI if they click it.
    // If they unsave from the library page, it will be removed via onUnsave.
    const [isSaved, setIsSaved] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const isOwner = user && post.author?.id === user.id;

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

    return (
        <article className="border-b border-border py-8 md:py-12 first:pt-0 last:border-0 flex flex-col-reverse sm:flex-row gap-6 md:gap-8 group justify-between items-start">
            <div className="flex-1 flex flex-col justify-center min-w-0 w-full sm:pr-4">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-3">
                    <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                        <img 
                            src={post.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                            alt={post.author?.displayName} 
                            className="w-6 h-6 rounded-full bg-border object-cover shrink-0"
                        />
                        <span className="text-sm font-medium text-text-h truncate max-w-[120px] sm:max-w-[150px]">{post.author?.displayName}</span>
                    </Link>
                    <span className="text-sm text-text shrink-0">in</span>
                    {post.category && (
                        <Link to={`/tag/${post.category.slug}`} className="text-sm font-medium text-text-h hover:underline shrink-0 truncate max-w-[100px] sm:max-w-[150px]">
                            {post.category.name}
                        </Link>
                    )}
                    <span className="text-xs text-text shrink-0">&bull;</span>
                    <span className="text-sm text-text shrink-0">{format(new Date(post.publishedAt || post.createdAt || Date.now()), 'MMM d')}</span>
                </div>

                <Link to={`/post/${post.slug}`} className="block mb-4">
                    <h2 className="text-[20px] sm:text-[24px] font-bold font-serif text-text-h mb-2 group-hover:text-text-h transition-colors tracking-tight leading-tight line-clamp-3 sm:line-clamp-2 w-full break-words">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="text-[#6B6B6B] text-[16px] font-sans leading-snug line-clamp-2 hidden sm:block mt-2">
                            {post.excerpt}
                        </p>
                    )}
                </Link>

                <div className="flex flex-wrap items-center justify-between mt-auto gap-y-4 relative">
                    <div className="flex items-center gap-4 sm:gap-6 text-sm text-text">
                        <div className="flex items-center gap-4">
                            <span onClick={(e) => { e.preventDefault(); handleClap(); }} className="flex items-center gap-1.5 hover:text-text-h cursor-pointer transition-colors" title="Claps">
                                <ThumbsUp size={18} strokeWidth={1.5} />
                                <span>{totalClaps}</span>
                            </span>
                            <span onClick={() => toast('Comments are coming soon!', { icon: '🚧' })} className="flex items-center gap-1.5 hover:text-text-h cursor-pointer transition-colors" title="Comments">
                                <MessageCircle size={18} strokeWidth={1.5} />
                                <span>0</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <span>{post.readTimeMin} min read</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-text">
                        <button onClick={handleHide} className="hover:text-text-h transition-colors" title="Show less like this">
                            <ThumbsDown size={20} strokeWidth={1.5} />
                        </button>
                        <button onClick={handleSave} className="hover:text-text-h transition-colors" title="Save">
                            <Bookmark size={20} strokeWidth={1.5} className={isSaved ? "fill-text-h text-text-h" : ""} />
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={(e) => { e.preventDefault(); setShowDropdown(!showDropdown); }} className="hover:text-text-h transition-colors focus:outline-none" title="More options">
                                <MoreHorizontal size={20} strokeWidth={1.5} />
                            </button>
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
            
            {post.coverImageUrl && (
                <div className="flex-shrink-0 w-full sm:w-[120px] md:w-auto pt-2 sm:pt-0">
                    <Link to={`/post/${post.slug}`} className="block w-full h-[200px] sm:w-[120px] sm:h-[80px] md:w-[200px] md:h-[134px] overflow-hidden rounded-md bg-social-bg">
                        <img 
                            src={post.coverImageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </Link>
                </div>
            )}
        </article>
    );
}
