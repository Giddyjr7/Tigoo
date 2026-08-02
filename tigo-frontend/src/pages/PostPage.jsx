import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, Plus, Check, ThumbsUp } from 'lucide-react';
import editorJsHtml from 'editorjs-html';
import DOMPurify from 'dompurify';
import { MOCK_POSTS, MOCK_COMMENTS } from '../mocks/mockData';
import PostActionBar from '../components/post/PostActionBar';
import PostAuthorCard from '../components/post/PostAuthorCard';
import GridPostCard from '../components/post/GridPostCard';
import ProgressRail from '../components/post/ProgressRail';

export default function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            const foundPost = MOCK_POSTS.find(p => p.slug === slug);
            if (foundPost) {
                setPost(foundPost);
                setError(null);
            } else {
                setError("Post not found. It may have been deleted or never existed.");
            }
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [slug]);

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

    const moreFromAuthor = MOCK_POSTS.filter(p => p.author.id === post.author.id && p.id !== post.id).slice(0, 2);
    const recommended = MOCK_POSTS.filter(p => p.id !== post.id).slice(0, 4);

    return (
        <div className="flex w-full relative">
            <ProgressRail />
            
            <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 xl:px-24 py-8">
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

                    <PostActionBar post={post} />

                    {post.coverImageUrl && (
                        <figure className="mb-12 w-full flex flex-col items-center">
                            <img 
                                src={post.coverImageUrl} 
                                alt={post.title}
                                className="w-full object-cover max-h-[600px] bg-social-bg"
                            />
                            <figcaption className="text-text text-sm italic mt-3">
                                Photo by Unsplash via MockData
                            </figcaption>
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

                    <div className="max-w-[680px] mx-auto mt-12 mb-8">
                        <p className="italic text-text text-sm">
                            Disclaimer: This is a mocked article page designed to demonstrate the TIGO structural layout. The content above is generated for display purposes only.
                        </p>
                    </div>

                    <PostActionBar post={post} />
                    <PostAuthorCard author={post.author} />
                </article>

                <section className="max-w-[800px] mx-auto mt-12 mb-16 border-b border-border pb-12">
                    <h2 className="text-2xl font-bold text-text-h font-serif mb-8 flex items-center gap-2">
                        Responses <span className="text-text text-lg font-sans font-normal">({MOCK_COMMENTS.length})</span>
                    </h2>
                    
                    <div className="bg-bg shadow-sm border border-border rounded-xl p-4 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Current" className="w-8 h-8 rounded-full" />
                            <span className="font-medium text-text-h text-sm">Current User</span>
                        </div>
                        <textarea 
                            placeholder="What are your thoughts?"
                            className="w-full bg-transparent resize-none outline-none text-text-h placeholder-text text-sm mb-2"
                            rows="2"
                        ></textarea>
                        <div className="flex justify-end">
                            <button className="px-4 py-1.5 bg-accent text-white rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors">
                                Respond
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {MOCK_COMMENTS.map(comment => (
                            <div key={comment.id} className="py-4 border-b border-border last:border-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={comment.author.avatarUrl} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="text-sm font-medium text-text-h">{comment.author.displayName}</div>
                                        <div className="text-xs text-text">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</div>
                                    </div>
                                </div>
                                <p className="text-text-h text-sm leading-relaxed mb-4">{comment.content}</p>
                                <div className="flex items-center gap-4 text-text text-sm">
                                    <button className="flex items-center gap-1 hover:text-text-h"><ThumbsUp size={16} /> {comment.clapCount}</button>
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
