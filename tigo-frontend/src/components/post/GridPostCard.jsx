import { Link } from 'react-router-dom';
import { MessageCircle, ThumbsUp, Bookmark, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GridPostCard({ post }) {
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

                <div className="mt-auto flex items-center justify-between text-text text-sm pt-4">
                    <div className="flex items-center gap-4">
                        <span>{post.readTimeMin} min read</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={16} /> {post.clapCount || 0}</span>
                        <span className="flex items-center gap-1" onClick={(e) => { e.preventDefault(); toast('Comments are coming soon!', { icon: '🚧' }); }}><MessageCircle size={16} className="cursor-pointer" /> 0</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.preventDefault(); toast('Bookmarks are coming soon!', { icon: '🚧' }); }} className="hover:text-text-h transition-colors" title="Bookmark"><Bookmark size={20} strokeWidth={1.5} /></button>
                        <button onClick={(e) => { e.preventDefault(); toast('More options coming soon!', { icon: '🚧' }); }} className="hover:text-text-h transition-colors" title="More"><MoreHorizontal size={20} strokeWidth={1.5} /></button>
                    </div>
                </div>
            </div>
        </article>
    );
}
