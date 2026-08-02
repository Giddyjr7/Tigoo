import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp } from 'lucide-react';

export default function PostCard({ post }) {
    return (
        <article className="border-b border-border py-8 first:pt-4 last:border-0 flex flex-col md:flex-row gap-6 group">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                    <Link to={`/profile/${post.author?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img 
                            src={post.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                            alt={post.author?.displayName} 
                            className="w-6 h-6 rounded-full bg-border object-cover border border-border"
                        />
                        <span className="text-sm font-medium text-text-h">{post.author?.displayName}</span>
                    </Link>
                    <span className="text-xs text-text">&bull;</span>
                    <span className="text-xs text-text">{format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}</span>
                </div>

                <Link to={`/post/${post.slug}`} className="block">
                    <h2 className="text-2xl font-bold text-text-h mb-2 group-hover:text-accent transition-colors tracking-tight">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="text-text text-base mb-4 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}
                </Link>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-4 text-xs text-text font-medium">
                        {post.category && (
                            <span className="bg-border px-2 py-1 rounded-full text-text-h">
                                {post.category.name}
                            </span>
                        )}
                        <span>{post.readTimeMin} min read</span>
                    </div>
                    <div className="flex items-center gap-4 text-text">
                        <div className="flex items-center gap-1.5" title="Claps">
                            <ThumbsUp size={16} />
                            <span className="text-xs">{post.clapCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Comments">
                            <MessageCircle size={16} />
                            <span className="text-xs">{/* For now, just 0 or placeholder since commentCount isn't directly on PostResponse if it's not aggregated yet */} 0</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {post.coverImageUrl && (
                <div className="md:w-[240px] flex-shrink-0 order-first md:order-last">
                    <Link to={`/post/${post.slug}`} className="block w-full h-[180px] md:h-[134px] overflow-hidden rounded-md border border-border">
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
