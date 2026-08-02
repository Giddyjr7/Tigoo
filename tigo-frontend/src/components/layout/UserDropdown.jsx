import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Bell, Settings, HelpCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { signOut } = useAuth();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleClose = () => setIsOpen(false);

    // Mock email masking
    const maskedEmail = user?.email 
        ? user.email.substring(0, 2) + '••••••••••' + user.email.substring(user.email.indexOf('@')) 
        : 'us••••••••••@gmail.com';

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center focus:outline-none"
            >
                {user ? (
                    <img 
                        src={user.avatarUrl || user.image} 
                        alt="avatar" 
                        className="w-8 h-8 rounded-full bg-border object-cover" 
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-social-bg text-text-muted hover:text-text-h border border-border flex items-center justify-center transition-colors">
                        <User size={20} strokeWidth={1.5} />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[264px] bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-[#F2F2F2] py-2 z-[100] flex flex-col text-[14px]">
                    
                    {user ? (
                        <>
                            {/* Profile Shortcut */}
                            <Link 
                                to={`/profile/${user.id}`} 
                                onClick={handleClose}
                                className="flex items-center gap-3 px-5 py-3 hover:text-[#242424] transition-colors"
                            >
                                <img 
                                    src={user.avatarUrl || user.image} 
                                    alt="avatar" 
                                    className="w-12 h-12 rounded-full bg-border object-cover" 
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#242424]">{user.displayName || user.name}</span>
                                    <span className="text-text text-[13px]">View profile</span>
                                </div>
                            </Link>

                            <div className="h-[1px] bg-[#F2F2F2] my-1" />

                            {/* Menu Items */}
                            <Link to="/write" onClick={handleClose} className="flex items-center gap-4 px-5 py-2 text-[#6B6B6B] hover:text-[#242424] transition-colors">
                                <PenSquare size={20} strokeWidth={1.5} />
                                <span>Write</span>
                            </Link>
                            <Link to="#" onClick={handleClose} className="flex items-center gap-4 px-5 py-2 text-[#6B6B6B] hover:text-[#242424] transition-colors">
                                <Bell size={20} strokeWidth={1.5} />
                                <span>Notifications</span>
                            </Link>
                            <Link to="/me/following" onClick={handleClose} className="flex items-center gap-4 px-5 py-2 text-[#6B6B6B] hover:text-[#242424] transition-colors">
                                <Settings size={20} strokeWidth={1.5} />
                                <span>Settings</span>
                            </Link>
                            <Link to="#" onClick={handleClose} className="flex items-center gap-4 px-5 py-2 text-[#6B6B6B] hover:text-[#242424] transition-colors">
                                <HelpCircle size={20} strokeWidth={1.5} />
                                <span>Help</span>
                            </Link>

                            <div className="h-[1px] bg-[#F2F2F2] my-2" />

                            {/* Stubs */}
                            <Link to="#" onClick={handleClose} className="px-5 py-1.5 text-[#6B6B6B] hover:text-[#242424] transition-colors flex items-center justify-between">
                                Become a TIGO member <span className="text-[#F5C518]">✦</span>
                            </Link>
                            <Link to="#" onClick={handleClose} className="px-5 py-1.5 text-[#6B6B6B] hover:text-[#242424] transition-colors">
                                Apply to the Partner Program
                            </Link>

                            <div className="h-[1px] bg-[#F2F2F2] my-2" />

                            {/* Sign Out */}
                            <button 
                                onClick={() => {
                                    handleClose();
                                    signOut();
                                }} 
                                className="flex flex-col items-start px-5 py-2 text-left hover:text-[#242424] transition-colors w-full"
                            >
                                <span className="text-[#6B6B6B] hover:text-[#242424]">Sign out</span>
                                <span className="text-text text-[13px] truncate w-full">{maskedEmail}</span>
                            </button>

                            <div className="h-[1px] bg-[#F2F2F2] mt-2 mb-3" />
                        </>
                    ) : (
                        <>
                            <div className="px-5 pt-3 pb-4 flex flex-col gap-3">
                                <Link 
                                    to="/login" 
                                    onClick={handleClose}
                                    className="block w-full py-2 bg-text-h text-bg rounded-full font-medium text-center hover:bg-opacity-90 transition-all text-[14px]"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/login" 
                                    onClick={handleClose}
                                    className="block w-full py-2 border border-border text-text-h rounded-full font-medium text-center hover:border-gray-400 transition-colors text-[14px]"
                                >
                                    Create Account
                                </Link>
                            </div>
                            <div className="h-[1px] bg-[#F2F2F2] mb-3" />
                        </>
                    )}

                    {/* Footer */}
                    <div className="px-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-text">
                        <Link to="#" className="hover:underline">About</Link>
                        <Link to="#" className="hover:underline">Blog</Link>
                        <Link to="#" className="hover:underline">Careers</Link>
                        <Link to="#" className="hover:underline">Privacy</Link>
                        <Link to="#" className="hover:underline">Terms</Link>
                        <Link to="#" className="hover:underline">Text to speech</Link>
                        <Link to="#" className="hover:underline">More</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
