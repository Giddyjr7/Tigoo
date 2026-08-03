import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp, Bookmark, MoreHorizontal, ThumbsDown } from 'lucide-react';
import { useClaps } from '../../hooks/useClaps';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
    const { totalClaps, handleClap } = useClaps(post.id, post.clapCount || 0);

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

                <div className="flex flex-wrap items-center justify-between mt-auto gap-y-4">
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
                        <button onClick={(e) => { e.preventDefault(); toast('Hide story is coming soon!', { icon: '🚧' }); }} className="hover:text-text-h transition-colors" title="Show less like this">
                            <ThumbsDown size={20} strokeWidth={1.5} />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); toast('Bookmarks are coming soon!', { icon: '🚧' }); }} className="hover:text-text-h transition-colors" title="Save">
                            <Bookmark size={20} strokeWidth={1.5} />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); toast('More options coming soon!', { icon: '🚧' }); }} className="hover:text-text-h transition-colors" title="More options">
                            <MoreHorizontal size={20} strokeWidth={1.5} />
                        </button>
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
