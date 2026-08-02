import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, User, FileText, BarChart2, Settings } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../mocks/mockData';

export default function Sidebar({ isOpen = true, toggleSidebar }) {
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
        <>
            {/* Mobile Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={toggleSidebar}
            />

            <aside 
                className={`flex flex-col bg-white overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out border-r border-border
                    fixed top-[57px] left-0 h-[calc(100vh-57px)] z-50 w-[260px] pl-6 pr-4
                    ${isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'}
                    md:sticky md:translate-x-0 md:flex-shrink-0 md:z-0
                    ${isOpen ? 'md:w-[260px] md:opacity-100 md:pl-6 md:pr-4' : 'md:w-0 md:px-0 md:border-r-transparent md:opacity-0'}
                `}
            >
            <div className="w-full flex flex-col flex-1 py-8">
                <nav className="flex flex-col gap-1 mb-10">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
                    return (
                        <Link 
                            key={item.label}
                            to={item.path} 
                            className={`flex items-center gap-4 py-2.5 px-3 rounded-md transition-colors text-base text-[#242424] hover:bg-social-bg ${isActive ? 'font-[600]' : 'font-[500]'}`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
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
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-text px-3 italic mb-1">Topics</span>
                    {MOCK_CATEGORIES.slice(0, 5).map(category => (
                        <Link 
                            key={category.id} 
                            to={`/tag/${category.slug}`}
                            className="flex items-center gap-3 py-2 px-3 text-[#292929] font-medium rounded-md hover:bg-social-bg transition-colors"
                        >
                            <div className="w-6 h-6 flex items-center justify-center bg-transparent rounded-full text-xs text-gray-500 border border-gray-300">
                                {category.name.charAt(0)}
                            </div>
                            <span className="text-[15px] truncate">{category.name}</span>
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
        </>
    );
}
