import { useState, useEffect } from 'react';
import { MOCK_FEATURED_POSTS } from '../mocks/mockData';
import PostCard from '../components/post/PostCard';
import RightSidebar from '../components/layout/RightSidebar';
import { api } from '../lib/api';

const TABS = [
    { id: 'for-you', label: 'For you' },
    { id: 'featured', label: 'Featured' }
];

export default function HomePage() {
    const [activeTab, setActiveTab] = useState('for-you');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async (pageNum, append = false) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/posts?page=${pageNum}&size=10`);
            const fetchedPosts = res.data.content;
            setPosts(prev => append ? [...prev, ...fetchedPosts] : fetchedPosts);
            setHasMore(!res.data.last);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'for-you') {
            fetchPosts(0);
            setPage(0);
        }
    }, [activeTab]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, true);
    };

    const handleTabClick = (tabId) => {
        if (tabId === activeTab) return;
        setActiveTab(tabId);
        window.scrollTo({ top: 0 });
    };

    const displayPosts = activeTab === 'featured' ? MOCK_FEATURED_POSTS : posts;

    return (
        <div className="flex w-full">
            <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-10 xl:px-14 py-8">
                <div className="border-b border-border mb-12">
                    <div className="flex gap-6 text-sm text-text">
                        {TABS.map(tab => (
                            <span
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`pb-4 cursor-pointer transition-colors -mb-px ${
                                    activeTab === tab.id
                                        ? 'text-text-h font-medium border-b border-text-h'
                                        : 'hover:text-text-h'
                                }`}
                            >
                                {tab.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    {displayPosts.length === 0 && !isLoading && (
                        <div className="text-center py-10 text-text">No stories found.</div>
                    )}
                    {displayPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    {isLoading && (
                        <div className="py-8 flex justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-text border-t-transparent animate-spin"></div>
                        </div>
                    )}
                    {activeTab === 'for-you' && hasMore && !isLoading && (
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
