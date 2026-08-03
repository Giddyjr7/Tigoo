import { useState, useRef, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Bookmark, PlayCircle, Share, MoreHorizontal, Repeat, Edit, Trash2, Flag, UserX, EyeOff } from 'lucide-react';
import { useClaps } from '../../hooks/useClaps';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function PostActionBar({ post, commentCount = 0 }) {
    const { totalClaps, userClaps, handleClap } = useClaps(post?.id, post?.clapCount || 0);
    const { user } = useAuth();
    const navigate = useNavigate();
    
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

    const handleSave = async () => {
        try {
            if (isSaved) {
                await api.delete(`/api/posts/${post.id}/save`);
                setIsSaved(false);
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
            toast.success('Post deleted');
            navigate('/');
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    return (
        <div className="flex items-center justify-between text-text py-3 my-8 border-y border-border max-w-[800px] mx-auto w-full">
            <div className="flex items-center gap-6">
                <button onClick={handleClap} className="flex items-center gap-2 hover:text-text-h transition-colors" title="Claps">
                    <ThumbsUp size={22} strokeWidth={1.2} className={userClaps > 0 ? "text-text-h" : ""} fill={userClaps > 0 ? "currentColor" : "none"} />
                    <span className="text-sm">{totalClaps}</span>
                </button>
                <button onClick={() => toast('Comments are coming soon!', { icon: '🚧' })} className="flex items-center gap-2 hover:text-text-h transition-colors" title="Comments">
                    <MessageCircle size={22} strokeWidth={1.2} />
                    <span className="text-sm">{commentCount}</span>
                </button>
                <button onClick={() => toast('Reposting is coming soon!', { icon: '🚧' })} className="flex items-center gap-2 hover:text-text-h transition-colors" title="Repost">
                    <Repeat size={22} strokeWidth={1.2} />
                </button>
            </div>
            <div className="flex items-center gap-5 relative">
                <button onClick={handleSave} className="hover:text-text-h transition-colors" title="Bookmark">
                    <Bookmark size={22} strokeWidth={1.2} className={isSaved ? "text-text-h" : ""} fill={isSaved ? "currentColor" : "none"} />
                </button>
                <button onClick={() => toast('Audio playback is coming soon!', { icon: '🚧' })} className="hover:text-text-h transition-colors" title="Listen">
                    <PlayCircle size={22} strokeWidth={1.2} />
                </button>
                <button onClick={() => toast('Sharing is coming soon!', { icon: '🚧' })} className="hover:text-text-h transition-colors" title="Share">
                    <Share size={22} strokeWidth={1.2} />
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setShowDropdown(!showDropdown)} className="hover:text-text-h transition-colors focus:outline-none" title="More options">
                        <MoreHorizontal size={22} strokeWidth={1.2} />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-border rounded-md shadow-lg py-1 z-10 flex flex-col overflow-hidden text-sm">
                            {isOwner ? (
                                <>
                                    <button onClick={() => { toast('Edit coming soon!'); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full">
                                        <Edit size={16} /> Edit Post
                                    </button>
                                    <button onClick={() => { handleDelete(); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full text-red-600">
                                        <Trash2 size={16} /> Delete Post
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { toast('Reported!'); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full">
                                        <Flag size={16} /> Report Post
                                    </button>
                                    <button onClick={() => { toast('Author muted!'); setShowDropdown(false); }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left w-full text-red-600">
                                        <UserX size={16} /> Mute Author
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
