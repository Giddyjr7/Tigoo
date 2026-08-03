import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/post/PostCard';
import RightSidebar from '../components/layout/RightSidebar';
import { api } from '../lib/api';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchResults = async (searchQuery, pageNum, append = false) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/posts?search=${encodeURIComponent(searchQuery)}&page=${pageNum}&size=10`);
            const fetchedPosts = res.data.content;
            setPosts(prev => append ? [...prev, ...fetchedPosts] : fetchedPosts);
            setHasMore(!res.data.last);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            if (!append) setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchResults(query, 0);
            setPage(0);
        } else {
            setPosts([]);
            setHasMore(false);
            setIsLoading(false);
        }
    }, [query]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchResults(query, nextPage, true);
    };

    return (
        <div className="flex w-full">
            <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-10 xl:px-14 py-8">
                <div className="border-b border-border mb-12 pb-6">
                    <h1 className="text-3xl font-bold text-text-h">
                        <span className="text-text font-normal">Results for </span>
                        {query}
                    </h1>
                </div>

                <div className="flex flex-col">
                    {posts.length === 0 && !isLoading && query && (
                        <div className="text-center py-10 text-text">No results found for '{query}'</div>
                    )}
                    {!query && (
                        <div className="text-center py-10 text-text">Enter a search term to find stories.</div>
                    )}
                    
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    
                    {isLoading && (
                        <div className="py-8 flex justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-text border-t-transparent animate-spin"></div>
                        </div>
                    )}
                    
                    {hasMore && !isLoading && (
                        <button 
                            onClick={handleLoadMore}
                            className="mt-8 mx-auto px-6 py-2 border border-border rounded-full text-sm font-medium hover:border-text transition-colors"
                        >
                            Load more
                        </button>
                    )}
                </div>
            </div>
            
            <RightSidebar />
        </div>
    );
}
