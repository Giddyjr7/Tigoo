import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, User, FileText, BarChart2, Settings } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../mocks/mockData';

export default function Sidebar({ isOpen = true }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Bookmark, label: 'Library', path: '/library' },
        { icon: User, label: 'Profile', path: '/profile/1' }, // Hardcoded for demo
        { icon: FileText, label: 'Stories', path: '/stories' },
        { icon: BarChart2, label: 'Stats', path: '/stats' }
    ];

    return (
        <aside 
            className={`flex-shrink-0 hidden md:flex flex-col sticky top-[57px] h-[calc(100vh-57px)] overflow-x-hidden overflow-y-auto transition-[width,padding,opacity] duration-300 ease-in-out
                ${isOpen ? 'w-[240px] pr-6 border-r border-border opacity-100' : 'w-0 pr-0 border-r-transparent opacity-0'}
            `}
        >
            <div className="w-[216px] flex flex-col flex-1 py-8">
                <nav className="flex flex-col gap-2 mb-10">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;
                    return (
                        <Link 
                            key={item.label}
                            to={item.path} 
                            className={`flex items-center gap-5 py-3 px-3 rounded-md transition-colors text-[15px] ${isActive ? 'text-text-h font-bold' : 'text-text hover:text-text-h hover:bg-social-bg'}`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mb-10">
                <div className="flex items-center justify-between text-text-h font-medium mb-4 px-3">
                    <h3>Following</h3>
                    <button className="text-text hover:text-text-h">
                        <Settings size={18} strokeWidth={1.5} />
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-text px-3 italic">Topics</span>
                    {MOCK_CATEGORIES.slice(0, 5).map(category => (
                        <Link 
                            key={category.id} 
                            to={`/tag/${category.slug}`}
                            className="flex items-center gap-4 py-2 px-3 text-text hover:text-text-h rounded-md hover:bg-social-bg transition-colors"
                        >
                            <div className="w-6 h-6 flex items-center justify-center bg-social-bg rounded-md text-xs font-medium border border-border">
                                {category.name.charAt(0)}
                            </div>
                            <span className="text-sm truncate">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
            
            <div className="mt-auto text-xs text-text px-3 flex flex-wrap gap-x-3 gap-y-2">
                <Link to="#" className="hover:underline">Help</Link>
                <Link to="#" className="hover:underline">Status</Link>
                <Link to="#" className="hover:underline">About</Link>
                <Link to="#" className="hover:underline">Careers</Link>
                <Link to="#" className="hover:underline">Privacy</Link>
                <Link to="#" className="hover:underline">Terms</Link>
            </div>
            </div>
        </aside>
    );
}
