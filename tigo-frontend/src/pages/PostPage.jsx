import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { format } from 'date-fns';
import { Loader2, MessageCircle, ThumbsUp } from 'lucide-react';

export default function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/api/posts/${slug}`);
                if (isMounted) {
                    setPost(res.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch post:", err);
                    if (err.response && err.response.status === 404) {
                        setError("Post not found. It may have been deleted or never existed.");
                    } else if (err.response && err.response.status === 403) {
                        setError("You do not have permission to view this draft.");
                    } else {
                        setError("Unable to load post. Please try again later.");
                    }
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPost();
        return () => { isMounted = false; };
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-text">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Oops!</h1>
                <p className="text-text">{error || "Post not found"}</p>
                <Link to="/" className="inline-block mt-6 text-accent hover:underline">
                    &larr; Back to Home
                </Link>
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-text-h leading-tight">
                {post.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <Link to={`/profile/${post.author?.id}`}>
                    <img 
                        src={post.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                        alt={post.author?.displayName} 
                        className="w-12 h-12 rounded-full bg-border object-cover border border-border"
                    />
                </Link>
                <div>
                    <Link to={`/profile/${post.author?.id}`} className="font-medium text-text-h hover:underline block">
                        {post.author?.displayName}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-text">
                        <span>{post.readTimeMin} min read</span>
                        <span>&bull;</span>
                        <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                </div>
            </div>

            {post.coverImageUrl && (
                <figure className="mb-10 w-full overflow-hidden rounded-lg border border-border">
                    <img 
                        src={post.coverImageUrl} 
                        alt={post.title}
                        className="w-full object-cover max-h-[500px]"
                    />
                </figure>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none text-text">
                {/* 
                  NOTE: Currently treating content as plain text / raw HTML string for Phase 5.
                  In Phase 6 (Editor), if this is Editor.js JSON, we will need a parser here (e.g. editorjs-html).
                */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between text-text">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2" title="Claps">
                        <ThumbsUp size={24} />
                        <span className="font-medium">{post.clapCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Comments">
                        <MessageCircle size={24} />
                        <span className="font-medium">0</span>
                    </div>
                </div>
                
                {post.category && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="bg-social-bg px-3 py-1 rounded-full">{post.category.name}</span>
                    </div>
                )}
            </div>
        </article>
    );
}
