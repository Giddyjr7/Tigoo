import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp, Bookmark, MoreHorizontal, ThumbsDown } from 'lucide-react';

export default function PostCard({ post }) {
    return (
        <article className="border-b border-border py-12 first:pt-0 last:border-0 flex flex-col-reverse md:flex-row gap-8 group justify-between items-start">
            <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
                <div className="flex items-center gap-2 mb-2">
                    <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img 
                            src={post.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                            alt={post.author?.displayName} 
                            className="w-6 h-6 rounded-full bg-border object-cover"
                        />
                        <span className="text-sm font-medium text-text-h">{post.author?.displayName}</span>
                    </Link>
                    <span className="text-sm text-text">in</span>
                    {post.category && (
                        <Link to={`/tag/${post.category.slug}`} className="text-sm font-medium text-text-h hover:underline">
                            {post.category.name}
                        </Link>
                    )}
                    <span className="text-xs text-text">&bull;</span>
                    <span className="text-sm text-text">{format(new Date(post.publishedAt || post.createdAt || Date.now()), 'MMM d')}</span>
                </div>

                <Link to={`/post/${post.slug}`} className="block mb-4">
                    <h2 className="text-[22px] font-extrabold font-sans text-text-h mb-1 group-hover:text-text-h transition-colors tracking-tight leading-[1.2] line-clamp-2">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="text-[#6B6B6B] text-[14px] font-sans leading-[1.4] line-clamp-2 hidden sm:block mt-1.5">
                            {post.excerpt}
                        </p>
                    )}
                </Link>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-6 text-sm text-text">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 hover:text-text-h cursor-pointer transition-colors" title="Claps">
                                <ThumbsUp size={18} strokeWidth={1.5} />
                                <span>{post.clapCount || 0}</span>
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-text-h cursor-pointer transition-colors" title="Comments">
                                <MessageCircle size={18} strokeWidth={1.5} />
                                <span>0</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <span>{post.readTimeMin} min read</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-text">
                        <button className="hover:text-text-h transition-colors" title="Show less like this">
                            <ThumbsDown size={20} strokeWidth={1.5} />
                        </button>
                        <button className="hover:text-text-h transition-colors" title="Save">
                            <Bookmark size={20} strokeWidth={1.5} />
                        </button>
                        <button className="hover:text-text-h transition-colors" title="More options">
                            <MoreHorizontal size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
            
            {post.coverImageUrl && (
                <div className="flex-shrink-0 md:pt-2 w-full md:w-auto">
                    <Link to={`/post/${post.slug}`} className="block w-full h-[200px] md:w-[152px] md:h-[152px] overflow-hidden rounded-md bg-social-bg">
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
