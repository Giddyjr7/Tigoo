import { Link, useParams } from 'react-router-dom';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import { MOCK_POSTS, MOCK_CATEGORIES } from '../mocks/mockData';

export default function TagPage() {
    const { slug } = useParams();

    // Map slug back to category name if possible, or format it
    const activeCategory = MOCK_CATEGORIES.find(c => c.slug === slug);
    const activeTopicName = activeCategory ? activeCategory.name : slug.charAt(0).toUpperCase() + slug.slice(1);

    const topics = [
        'Programming',
        'Technology',
        'Design',
        'Writing',
        'Machine Learning',
        'Cryptocurrency',
        'Marketing',
        'Work',
        'Investing',
        'Finance'
    ];

    return (
        <div className="flex justify-center w-full min-h-screen">
            <div className="w-full max-w-[728px] px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-[42px] font-bold font-sans text-[#242424] tracking-tight mb-8">Following</h1>
                    
                    {/* Top Navigation Row */}
                    <div className="flex items-center gap-3 mb-6">
                        <button className="px-4 py-2 rounded-full border border-border text-[14px] text-text hover:border-gray-400 transition-colors">
                            Writers and publications
                        </button>
                        <button className="px-4 py-2 rounded-full border border-[#242424] text-[14px] text-[#242424] font-medium transition-colors">
                            Topics
                        </button>
                        <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text hover:border-gray-400 transition-colors">
                            <Plus size={18} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Secondary Navigation Row (Topics Carousel) */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f9f9f9] border border-transparent text-[14px] text-[#242424] hover:bg-black/5 transition-colors whitespace-nowrap">
                            Recommended
                            <ChevronDown size={14} />
                        </button>

                        {topics.map(topic => {
                            const isSelected = topic.toLowerCase() === activeTopicName.toLowerCase();
                            return (
                                <Link 
                                    key={topic}
                                    to={`/tag/${topic.toLowerCase().replace(/ /g, '-')}`}
                                    className={`px-4 py-2 rounded-full text-[14px] transition-colors whitespace-nowrap ${
                                        isSelected 
                                            ? 'border border-[#242424] text-[#242424] font-medium' 
                                            : 'bg-[#f9f9f9] text-[#242424] hover:bg-black/5'
                                    }`}
                                >
                                    {topic}
                                </Link>
                            );
                        })}

                        <button className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-text hover:bg-black/5 transition-colors">
                            <ChevronRight size={18} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                <div className="border-b border-border mb-8"></div>

                {/* Feed Section */}
                <div className="flex flex-col">
                    {MOCK_POSTS.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}
