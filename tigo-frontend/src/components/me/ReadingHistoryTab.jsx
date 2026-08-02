import { Link } from 'react-router-dom';
import { Trash2, ThumbsUp, MessageCircle, BookmarkPlus, MoreHorizontal } from 'lucide-react';
import { MOCK_POSTS } from '../../mocks/mockData';

export default function ReadingHistoryTab() {
    return (
        <div>
            {/* Clear History Banner */}
            <div className="bg-[#f9f9f9] rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <span className="text-[15px] text-[#242424] font-medium">
                    You can clear your reading history for a fresh start.
                </span>
                <button className="bg-[#c9184a] text-white px-5 py-2 rounded-full text-[14px] font-medium hover:bg-red-700 transition-colors whitespace-nowrap">
                    Clear history
                </button>
            </div>

            {/* History List */}
            <div className="flex flex-col">
                {MOCK_POSTS.map(post => (
                    <div key={post.id} className="py-8 first:pt-0 border-b border-border last:border-0 flex flex-col md:flex-row gap-6">
                        
                        {/* Main Post Content */}
                        <div className="flex-1 min-w-0">
                            {/* Author Info */}
                            <div className="flex items-center gap-2 mb-2">
                                <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2 group">
                                    <img src={post.author.avatarUrl} alt={post.author.displayName} className="w-5 h-5 rounded-full bg-border object-cover" />
                                    <span className="text-[14px] font-medium text-[#242424] group-hover:underline">
                                        {post.author.displayName}
                                    </span>
                                </Link>
                                <span className="text-text text-[14px]">· 1d ago</span>
                            </div>
                            
                            {/* Title & Excerpt */}
                            <Link to={`/post/${post.slug}`} className="group block mb-4">
                                <h2 className="text-[20px] font-bold text-[#242424] leading-tight mb-2 group-hover:underline">
                                    {post.title}
                                </h2>
                                <p className="text-[15px] text-text line-clamp-2 leading-snug">
                                    {post.excerpt}
                                </p>
                            </Link>
                            
                            {/* Footer Actions */}
                            <div className="flex items-center justify-between text-text">
                                <div className="flex items-center gap-4 text-[13px]">
                                    <span className="flex items-center gap-1.5 hover:text-[#242424] transition-colors cursor-pointer">
                                        <ThumbsUp size={16} /> {post.clapCount}
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-[#242424] transition-colors cursor-pointer">
                                        <MessageCircle size={16} /> 3
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="text-text hover:text-[#242424] transition-colors" title="Remove from history">
                                        <Trash2 size={20} strokeWidth={1.5} />
                                    </button>
                                    <button className="text-text hover:text-[#242424] transition-colors">
                                        <BookmarkPlus size={20} strokeWidth={1.5} />
                                    </button>
                                    <button className="text-text hover:text-[#242424] transition-colors">
                                        <MoreHorizontal size={20} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail */}
                        {post.coverImageUrl && (
                            <Link to={`/post/${post.slug}`} className="flex-shrink-0 order-first md:order-last">
                                <img 
                                    src={post.coverImageUrl} 
                                    alt={post.title} 
                                    className="w-full md:w-[160px] h-[106px] object-cover bg-border" 
                                />
                            </Link>
                        )}
                        
                    </div>
                ))}
            </div>
        </div>
    );
}
