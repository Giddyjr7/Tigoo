import { MOCK_POSTS } from '../mocks/mockData';
import PostCard from '../components/post/PostCard';
import RightSidebar from '../components/layout/RightSidebar';

export default function HomePage() {
    return (
        <div className="flex w-full">
            <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-10 xl:px-14 py-8">
                <div className="border-b border-border mb-12">
                    <div className="flex gap-6 text-sm text-text">
                        <span className="text-text-h font-medium pb-4 border-b border-text-h cursor-pointer -mb-px">For you</span>
                        <span className="hover:text-text-h cursor-pointer pb-4 transition-colors">Following</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    {MOCK_POSTS.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
            
            <RightSidebar />
        </div>
    );
}
