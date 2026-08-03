import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { MOCK_USERS, MOCK_WHO_TO_FOLLOW } from '../../mocks/mockData';
import toast from 'react-hot-toast';

export default function ProfileRightSidebar({ user = MOCK_USERS[0], isOwnProfile = false }) {
    return (
        <aside className="w-[320px] flex-shrink-0 pl-8 border-l border-border hidden lg:block py-12 pr-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">

            {/* User Info */}
            <div className="mb-10">
                <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-20 h-20 rounded-full bg-border object-cover mb-4"
                />
                <h2 className="text-base font-bold text-text-h mb-2">{user.displayName}</h2>
                {isOwnProfile ? (
                    <Link to="#" className="text-accent text-sm hover:text-green-700 transition-colors">
                        Edit profile
                    </Link>
                ) : (
                    <button 
                        onClick={() => toast('Following writers is coming soon!', { icon: '🚧' })}
                        className="text-accent text-sm hover:text-green-700 transition-colors"
                    >
                        Follow
                    </button>
                )}
            </div>

            {/* Following Section */}
            <div className="mb-10">
                <h3 className="text-base font-bold text-text-h mb-4">Following</h3>
                <div className="flex flex-col gap-4">
                    {MOCK_WHO_TO_FOLLOW.filter(followed => followed.id !== user.id).map(followed => (
                        <div key={followed.id} className="flex gap-3 items-center justify-between group">
                            <Link to={`/profile/${followed.id}`} className="flex items-center gap-3 min-w-0">
                                <img src={followed.avatarUrl} alt={followed.displayName} className="w-6 h-6 rounded-full bg-border object-cover flex-shrink-0" />
                                <span className="text-[14px] text-text-h truncate group-hover:underline">{followed.displayName}</span>
                            </Link>
                            <button className="text-text hover:text-text-h transition-colors">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <Link to="#" className="block mt-6 text-sm text-text hover:text-text-h transition-colors">
                    See all
                </Link>
            </div>
            
            {/* Footer */}
            <div className="text-[13px] text-text flex flex-wrap gap-x-4 gap-y-2 mt-8">
                <Link to="#" className="hover:underline">Help</Link>
                <Link to="#" className="hover:underline">Status</Link>
                <Link to="#" className="hover:underline">About</Link>
                <Link to="#" className="hover:underline">Careers</Link>
                <Link to="#" className="hover:underline">Press</Link>
                <Link to="#" className="hover:underline">Blog</Link>
                <Link to="#" className="hover:underline">Store</Link>
                <Link to="#" className="hover:underline">Privacy</Link>
                <Link to="#" className="hover:underline">Rules</Link>
                <Link to="#" className="hover:underline">Terms</Link>
                <Link to="#" className="hover:underline">Text to speech</Link>
            </div>
            
        </aside>
    );
}
