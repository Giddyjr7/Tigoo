import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MOCK_RECOMMENDED_TOPICS, MOCK_WHO_TO_FOLLOW } from '../../mocks/mockData';
import toast from 'react-hot-toast';

export default function RightSidebar() {
    return (
        <aside className="w-[320px] flex-shrink-0 pl-8 border-l border-border hidden lg:block py-8 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
            
            <div className="mb-10">
                <h3 className="text-base font-bold text-text-h mb-4">Recommended topics</h3>
                <div className="flex flex-wrap gap-2.5">
                    {MOCK_RECOMMENDED_TOPICS.map(topic => (
                        <Link 
                            key={topic.id} 
                            to={`/tag/${topic.slug}`}
                            className="bg-[#F2F2F2] hover:bg-border px-4 py-2 rounded-full text-[14px] text-text-h transition-colors flex items-center gap-1.5"
                        >
                            {topic.name}
                            <Plus size={14} className="text-text" />
                        </Link>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-base font-bold text-text-h mb-4">Who to follow</h3>
                <div className="flex flex-col gap-6">
                    {MOCK_WHO_TO_FOLLOW.slice(0, 3).map(user => (
                        <div key={user.id} className="flex gap-3 items-start">
                            <Link to={`/profile/${user.id}`}>
                                <img src={user.avatarUrl} alt={user.displayName} className="w-8 h-8 rounded-full bg-border object-cover" />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link to={`/profile/${user.id}`} className="block">
                                    <h4 className="font-bold text-text-h text-sm truncate hover:underline">{user.displayName}</h4>
                                    <p className="text-text text-sm line-clamp-2 leading-snug">{user.bio}</p>
                                </Link>
                            </div>
                            <button 
                                onClick={() => toast('Following writers is coming soon!', { icon: '🚧' })}
                                className="px-4 py-1.5 bg-text-h text-bg hover:bg-opacity-80 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                            >
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
        </aside>
    );
}
