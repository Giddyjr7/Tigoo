import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { MOCK_WHO_TO_FOLLOW } from '../../mocks/mockData';

export default function ProfileRightSidebar() {
    return (
        <aside className="w-[320px] flex-shrink-0 pl-8 border-l border-border hidden lg:block py-12 pr-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
            
            {/* User Info */}
            <div className="mb-10">
                <div className="w-20 h-20 bg-[#c9184a] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                    M
                </div>
                <h2 className="text-base font-bold text-text-h mb-2">Menegideon</h2>
                <Link to="#" className="text-accent text-sm hover:text-green-700 transition-colors">
                    Edit profile
                </Link>
            </div>

            {/* Following Section */}
            <div className="mb-10">
                <h3 className="text-base font-bold text-text-h mb-4">Following</h3>
                <div className="flex flex-col gap-4">
                    {/* Mock users with different names for following */}
                    {[
                        { id: 101, name: 'Keith McNulty', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Keith' },
                        { id: 102, name: 'Jan Kammerath', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jan' },
                        { id: 103, name: 'Chris Dunlop', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
                        { id: 104, name: 'Generative AI', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=GenAI' },
                        { id: 105, name: 'Data Science Collective', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DSC' },
                    ].map(user => (
                        <div key={user.id} className="flex gap-3 items-center justify-between group">
                            <Link to={`/profile/${user.id}`} className="flex items-center gap-3 min-w-0">
                                <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full bg-border object-cover flex-shrink-0" />
                                <span className="text-[14px] text-text-h truncate group-hover:underline">{user.name}</span>
                            </Link>
                            <button className="text-text hover:text-text-h transition-colors">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <Link to="#" className="block mt-6 text-sm text-text hover:text-text-h transition-colors">
                    See all (19)
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
