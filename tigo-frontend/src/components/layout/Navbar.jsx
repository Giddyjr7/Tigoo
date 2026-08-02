import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, PenSquare, Search, Bell, Menu } from 'lucide-react';
import { MOCK_USERS } from '../../mocks/mockData';

export default function Navbar({ sidebarOpen, toggleSidebar }) {
    const { user, signOut } = useAuth();
    const displayUser = user || MOCK_USERS[0];
    
    return (
        <nav className="flex justify-between items-center py-2 px-6 border-b border-[#F2F2F2] bg-white sticky top-0 z-50 h-[57px]">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={toggleSidebar} 
                    className="p-1 text-text hover:text-text-h transition-colors hidden md:block"
                    title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="text-3xl font-bold font-serif text-text-h tracking-tighter">
                    TIGO
                </Link>
                <div className="hidden md:flex items-center bg-[#F9F9F9] rounded-full px-4 py-2 ml-4 focus-within:bg-white focus-within:border focus-within:border-border transition-colors border border-transparent">
                    <Search size={20} className="text-text" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-transparent border-none outline-none ml-2 text-sm w-48 text-text-h placeholder-text"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <Link to="/write" className="flex items-center gap-2 text-text-h hover:text-text transition-colors text-sm">
                    <PenSquare size={24} strokeWidth={1.5} />
                    <span className="hidden sm:inline">Write</span>
                </Link>
                {displayUser ? (
                    <div className="flex items-center gap-5">
                        <button className="text-text hover:text-text-h transition-colors">
                            <Bell size={24} strokeWidth={1.5} />
                        </button>
                        <Link to={`/profile/${displayUser.id}`}>
                            <img src={displayUser.avatarUrl || displayUser.image} alt="avatar" className="w-8 h-8 rounded-full bg-border object-cover" />
                        </Link>
                        {user && (
                            <button onClick={signOut} className="text-text hover:text-accent transition-colors flex items-center" title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="px-4 py-2 bg-text-h text-bg rounded-full font-medium hover:bg-opacity-90 transition-all text-sm">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
