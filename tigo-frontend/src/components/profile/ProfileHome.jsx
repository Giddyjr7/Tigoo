import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import PostCard from '../post/PostCard';
import { Loader2 } from 'lucide-react';

export default function ProfileHome() {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/api/posts/user/${userId}?page=0&size=20`);
                setPosts(res.data.content);
            } catch (err) {
                console.error("Failed to fetch user posts", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchPosts();
        }
    }, [userId]);

    return (
        <div className="flex flex-col mt-4">
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-text" />
                </div>
            ) : posts.length > 0 ? (
                <div className="flex flex-col">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center text-text">
                    This user hasn't published any stories yet.
                </div>
            )}
        </div>
    );
}
