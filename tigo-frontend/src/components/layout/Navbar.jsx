import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, PenSquare } from 'lucide-react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    
    return (
        <nav className="flex justify-between items-center py-4 px-6 border-b border-border bg-bg sticky top-0 z-10">
            <Link to="/" className="text-3xl font-bold font-serif text-accent tracking-tighter">
                TIGO
            </Link>
            <div className="flex gap-6 items-center">
                {user ? (
                    <>
                        <Link to="/write" className="flex items-center gap-2 text-text-h hover:text-accent transition-colors">
                            <PenSquare size={20} />
                            <span className="hidden sm:inline">Write</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link to={`/profile/${user.id}`}>
                                <img src={user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt="avatar" className="w-9 h-9 rounded-full bg-border object-cover border border-border" />
                            </Link>
                            <button onClick={signOut} className="text-text hover:text-accent transition-colors flex items-center gap-1" title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="px-5 py-2 bg-accent text-white rounded-full font-medium hover:bg-opacity-90 transition-all text-sm">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
