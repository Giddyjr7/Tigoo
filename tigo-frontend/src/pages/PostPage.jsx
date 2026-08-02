import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, Plus, Check, ThumbsUp } from 'lucide-react';
import DOMPurify from 'dompurify';
import { MOCK_POSTS } from '../mocks/mockData';
import PostActionBar from '../components/post/PostActionBar';
import PostAuthorCard from '../components/post/PostAuthorCard';
import GridPostCard from '../components/post/GridPostCard';
import ProgressRail from '../components/post/ProgressRail';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PostPage() {
    const { slug } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [moreFromAuthor, setMoreFromAuthor] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/api/posts/${slug}`);
                setPost(res.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Post not found. It may have been deleted or never existed.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    useEffect(() => {
        if (!post) return;
        
        const fetchRelatedData = async () => {
            try {
                const [commentsRes, authorPostsRes] = await Promise.all([
                    api.get(`/api/posts/${post.id}/comments`),
                    api.get(`/api/posts/user/${post.author.id}?page=0&size=5`)
                ]);
                
                setComments(commentsRes.data);
                
                // Filter out current post and limit to 2
                const filteredAuthorPosts = authorPostsRes.data.content
                    .filter(p => p.id !== post.id)
                    .slice(0, 2);
                setMoreFromAuthor(filteredAuthorPosts);
                
            } catch (err) {
                console.error("Failed to fetch related data", err);
            }
        };
        
        fetchRelatedData();
    }, [post]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !user) return;
        
        setIsSubmittingComment(true);
        try {
            await api.post(`/api/posts/${post.id}/comments`, { content: newComment });
            setNewComment('');
            const commentsRes = await api.get(`/api/posts/${post.id}/comments`);
            setComments(commentsRes.data);
            toast.success("Comment added");
        } catch (err) {
            console.error("Failed to add comment", err);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-text w-full">
                <div className="w-8 h-8 rounded-full border-2 border-text border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center py-20 w-full">
                <h1 className="text-3xl font-bold mb-4 font-serif text-text-h">Oops!</h1>
                <p className="text-text">{error || "Post not found"}</p>
                <Link to="/" className="inline-block mt-6 text-text-h hover:underline">
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    const recommended = MOCK_POSTS.filter(p => p.id !== post.id).slice(0, 4);

    return (
        <div className="flex w-full relative">
            <ProgressRail />
            
            <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-10 xl:px-14 py-8">
                <article className="w-full">
                    <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-6 max-w-[800px] mx-auto pb-1 w-full">
                        {post.tags?.map((tag, idx) => {
                            const name = typeof tag === 'object' ? tag.name : tag;
                            const followed = typeof tag === 'object' ? tag.followed : false;
                            return (
                                <div key={idx} className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1 bg-social-bg rounded-full text-xs text-text-h cursor-pointer hover:bg-border transition-colors whitespace-nowrap">
                                    <span>{name}</span>
                                    {followed ? <Check size={12} /> : <Plus size={12} />}
                                </div>
                            );
                        })}
                    </div>

                    <h1 className="text-4xl md:text-[44px] font-bold mb-8 tracking-tight text-text-h leading-[1.1] font-serif max-w-[800px] mx-auto">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-4 max-w-[800px] mx-auto">
                        <Link to={`/profile/${post.author?.id}`}>
                            <img 
                                src={post.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                                alt={post.author?.displayName} 
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </Link>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                                <Link to={`/profile/${post.author?.id}`} className="font-medium text-text-h hover:underline">
                                    {post.author?.displayName}
                                </Link>
                                <CheckCircle size={14} className="text-accent fill-accent text-bg" />
                                <span className="text-text">&bull;</span>
                                <button className="text-accent font-medium hover:text-text-h transition-colors">Follow</button>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text mt-0.5">
                                <span>{post.readTimeMin} min read</span>
                                <span>&bull;</span>
                                <span>{format(new Date(post.publishedAt || post.createdAt || Date.now()), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    <PostActionBar post={post} commentCount={comments.length} />

                    {post.coverImageUrl && (
                        <figure className="mb-12 w-full flex flex-col items-center">
                            <img 
                                src={post.coverImageUrl} 
                                alt={post.title}
                                className="w-full object-cover max-h-[600px] bg-social-bg"
                            />
                        </figure>
                    )}

                    <div className="prose prose-lg mx-auto max-w-[680px] text-text text-left prose-headings:font-serif prose-headings:font-bold prose-headings:text-text-h prose-p:leading-relaxed prose-p:my-6 prose-headings:mt-12 prose-headings:mb-6">
                        {(() => {
                            try {
                                const parsedData = JSON.parse(post.content);
                                
                                const htmlList = parsedData.blocks.map(block => {
                                    switch (block.type) {
                                        case 'paragraph': 
                                            return `<p>${block.data.text}</p>`;
                                        case 'header': 
                                            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                                        case 'list':
                                            const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
                                            const items = block.data.items.map(item => `<li>${item}</li>`).join('');
                                            return `<${tag}>${items}</${tag}>`;
                                        case 'image':
                                            const url = block.data.file?.url || block.data.url;
                                            return `<figure><img src="${url}" alt="${block.data.caption || ''}" /><figcaption>${block.data.caption || ''}</figcaption></figure>`;
                                        case 'quote':
                                            return `<blockquote><p>${block.data.text}</p><cite>${block.data.caption || ''}</cite></blockquote>`;
                                        default:
                                            return '';
                                    }
                                });
                                
                                const ctaHtml = `
                                    <div class="my-10 p-6 bg-social-bg rounded-lg border border-border flex flex-col items-center text-center not-prose">
                                        <h3 class="mt-0 mb-2 font-bold text-lg text-text-h">Want to build better React apps?</h3>
                                        <p class="mb-4 text-sm text-text">Join 10,000+ developers getting our weekly deep-dive newsletter.</p>
                                        <button class="px-6 py-2 bg-text-h text-bg rounded-full font-medium text-sm">Learn more</button>
                                    </div>
                                `;
                                
                                if (htmlList.length > 3) {
                                    htmlList.splice(3, 0, ctaHtml);
                                }
                                
                                if (htmlList.length > 6) {
                                    htmlList.splice(6, 0, '<div class="text-center text-2xl tracking-[0.5em] my-10 font-serif">· · ·</div>');
                                }

                                const rawHtml = htmlList.join('');
                                const sanitizedHtml = DOMPurify.sanitize(rawHtml);
                                return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
                            } catch (e) {
                                console.error('Error parsing post content:', e);
                                return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />;
                            }
                        })()}
                    </div>

                    <PostActionBar post={post} commentCount={comments.length} />
                    <PostAuthorCard author={post.author} />
                </article>

                <section className="max-w-[800px] mx-auto mt-12 mb-16 border-b border-border pb-12">
                    <h2 className="text-2xl font-bold text-text-h font-serif mb-8 flex items-center gap-2">
                        Responses <span className="text-text text-lg font-sans font-normal">({comments.length})</span>
                    </h2>
                    
                    {user ? (
                        <div className="bg-bg shadow-sm border border-border rounded-xl p-4 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} className="w-8 h-8 rounded-full" />
                                <span className="font-medium text-text-h text-sm">{user.displayName}</span>
                            </div>
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What are your thoughts?"
                                className="w-full bg-transparent resize-none outline-none text-text-h placeholder-text text-sm mb-2"
                                rows="2"
                                disabled={isSubmittingComment}
                            ></textarea>
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleCommentSubmit}
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    className="px-4 py-1.5 bg-accent text-white rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                >
                                    {isSubmittingComment ? 'Posting...' : 'Respond'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-bg shadow-sm border border-border rounded-xl p-6 mb-8 text-center">
                            <p className="text-text mb-4">Sign in to leave a response.</p>
                            <Link to="/login" className="px-6 py-2 bg-text-h text-bg rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors inline-block">
                                Sign In
                            </Link>
                        </div>
                    )}

                    <div className="flex flex-col gap-6">
                        {comments.length === 0 && (
                            <div className="text-text py-4">No responses yet. Be the first to share your thoughts!</div>
                        )}
                        {comments.map(comment => (
                            <div key={comment.id} className="py-4 border-b border-border last:border-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <Link to={`/profile/${comment.author?.id}`}>
                                        <img src={comment.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} className="w-8 h-8 rounded-full bg-border" />
                                    </Link>
                                    <div>
                                        <Link to={`/profile/${comment.author?.id}`} className="text-sm font-medium text-text-h hover:underline">
                                            {comment.author?.displayName}
                                        </Link>
                                        <div className="text-xs text-text">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</div>
                                    </div>
                                </div>
                                <p className="text-text-h text-sm leading-relaxed mb-4 whitespace-pre-wrap">{comment.content}</p>
                                <div className="flex items-center gap-4 text-text text-sm">
                                    <button className="flex items-center gap-1 hover:text-text-h">
                                        <ThumbsUp size={16} /> 0
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="max-w-[1000px] mx-auto border-t border-border pt-12">
                    {moreFromAuthor.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold font-serif text-text-h mb-8">More from {post.author.displayName}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {moreFromAuthor.map(p => <GridPostCard key={p.id} post={p} />)}
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <h2 className="text-2xl font-bold font-serif text-text-h mb-8">Recommended from Medium</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {recommended.map(p => <GridPostCard key={p.id} post={p} />)}
                        </div>
                        <div className="flex justify-center">
                            <button className="px-6 py-2 border border-text-h text-text-h rounded-full text-sm font-medium hover:bg-text-h hover:text-bg transition-colors">
                                See more recommendations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
