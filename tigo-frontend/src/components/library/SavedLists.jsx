import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import PostCard from '../post/PostCard';
import { Loader2 } from 'lucide-react';

export default function SavedLists() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await api.get('/api/posts/saved');
                setPosts(response.data.content);
            } catch (err) {
                console.error('Failed to fetch saved posts', err);
                setError('Failed to load saved posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    const handleRemovePost = (postId) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 py-10 text-center">{error}</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-base font-bold text-text-h mb-2">No saved posts</h3>
                <p className="text-[15px] text-text">
                    Save a post and it will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    onHide={() => handleRemovePost(post.id)}
                    onUnsave={() => handleRemovePost(post.id)}
                    onDelete={() => handleRemovePost(post.id)}
                />
            ))}
        </div>
    );
}
