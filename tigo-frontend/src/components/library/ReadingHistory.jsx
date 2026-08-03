import { MOCK_POSTS } from '../../mocks/mockData';
import PostCard from '../post/PostCard';
import toast from 'react-hot-toast';

export default function ReadingHistory() {
    return (
        <div className="flex flex-col">
            {/* Banner */}
            <div className="bg-[#fafafa] rounded-md p-6 flex flex-col sm:flex-row sm:items-center justify-between mb-10 border border-transparent">
                <p className="text-text-h text-[15px] mb-4 sm:mb-0">
                    You can clear your reading history for a fresh start.
                </p>
                <button 
                    onClick={() => toast('Clearing history is coming soon!', { icon: '🚧' })}
                    className="bg-[#c94a4a] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#b03d3d] transition-colors self-start sm:self-auto"
                >
                    Clear history
                </button>
            </div>

            {/* Posts List */}
            <div className="flex flex-col">
                {MOCK_POSTS.slice(0, 3).map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
