import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { MOCK_WHO_TO_FOLLOW } from '../../mocks/mockData';

export default function FollowingTab() {
    return (
        <div>
            <h2 className="text-base font-bold text-[#242424] mb-8 md:mb-10">{MOCK_WHO_TO_FOLLOW.length} writers</h2>
            
            <div className="flex flex-col">
                {MOCK_WHO_TO_FOLLOW.map(user => (
                    <div key={user.id} className="flex gap-4 items-start py-8 first:pt-0 border-b border-border last:border-0">
                        <Link to={`/profile/${user.id}`} className="flex-shrink-0">
                            <img src={user.avatarUrl} alt={user.displayName} className="w-12 h-12 rounded-full bg-border object-cover" />
                        </Link>
                        
                        <div className="flex-1 min-w-0 pr-4">
                            <Link to={`/profile/${user.id}`} className="inline-block group">
                                <h3 className="text-base font-bold text-[#242424] group-hover:underline">
                                    {user.displayName}
                                </h3>
                            </Link>
                            <p className="text-[15px] text-text line-clamp-2 mt-1">
                                {user.bio}
                            </p>
                        </div>
                        
                        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-[14px] text-text hover:border-gray-400 transition-colors whitespace-nowrap">
                            Following
                            <ChevronDown size={14} className="text-text" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
