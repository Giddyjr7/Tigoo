import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import PostCard from '../components/post/PostCard';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchInitialPosts = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/api/posts?page=0&size=10`);
                if (isMounted) {
                    setPosts(res.data.content);
                    setHasMore(!res.data.last);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to fetch posts:", err);
                    setError("Unable to load latest posts. Please try again later.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchInitialPosts();
        return () => { isMounted = false; };
    }, []);

    const loadMore = async () => {
        if (isFetchingMore || !hasMore) return;
        
        try {
            setIsFetchingMore(true);
            const nextPage = page + 1;
            const res = await api.get(`/api/posts?page=${nextPage}&size=10`);
            setPosts(prev => [...prev, ...res.data.content]);
            setPage(nextPage);
            setHasMore(!res.data.last);
        } catch (err) {
            console.error("Failed to fetch more posts:", err);
        } finally {
            setIsFetchingMore(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-text">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
                    <p className="text-text">Check back later for exciting content!</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    
                    {hasMore && (
                        <div className="mt-8 text-center">
                            <button 
                                onClick={loadMore}
                                disabled={isFetchingMore}
                                className="px-6 py-2 rounded-full border border-border text-text hover:text-accent hover:border-accent transition-colors disabled:opacity-50"
                            >
                                {isFetchingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
