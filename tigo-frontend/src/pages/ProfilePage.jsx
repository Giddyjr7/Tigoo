import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import ProfileRightSidebar from '../components/layout/ProfileRightSidebar';
import ProfileHome from '../components/profile/ProfileHome';
import ProfileReposts from '../components/profile/ProfileReposts';
import ProfileActivity from '../components/profile/ProfileActivity';
import ProfileAbout from '../components/profile/ProfileAbout';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../mocks/mockData';

export default function ProfilePage() {
    const { userId } = useParams();
    const location = useLocation();
    const { user: loggedInUser } = useAuth();

    const profileUser = MOCK_USERS.find(u => String(u.id) === userId) || MOCK_USERS[0];
    const isOwnProfile = Boolean(loggedInUser) && String(loggedInUser.id) === String(profileUser.id);

    // Base path for tabs
    const basePath = `/profile/${userId}`;

    // Strip trailing slashes and the base path to figure out the active tab
    const pathname = location.pathname.replace(/\/$/, '');

    // Medium's tabs: Home, Reposts, Activity, About
    const tabs = [
        { name: 'Home', path: basePath, exact: true },
        { name: 'Reposts', path: `${basePath}/reposts` },
        { name: 'Activity', path: `${basePath}/activity` },
        { name: 'About', path: `${basePath}/about` },
    ];

    return (
        <div className="flex w-full">
            <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-10 xl:px-14 py-12 flex justify-center">
                <div className="w-full max-w-[700px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4 min-w-0">
                            <img
                                src={profileUser.avatarUrl}
                                alt={profileUser.displayName}
                                className="w-14 h-14 rounded-full bg-border object-cover flex-shrink-0"
                            />
                            <h1 className="!m-0 text-3xl md:text-[42px] font-bold text-text-h tracking-tight truncate">{profileUser.displayName}</h1>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {isOwnProfile ? (
                                <Link to={`${basePath}/about`} className="px-4 py-1.5 rounded-full border border-border text-text-h text-[14px] font-medium hover:border-gray-400 transition-colors whitespace-nowrap">
                                    Edit profile
                                </Link>
                            ) : (
                                <button className="px-4 py-1.5 rounded-full bg-text-h text-bg text-[14px] font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap">
                                    Follow
                                </button>
                            )}
                            <button className="text-text hover:text-text-h transition-colors">
                                <MoreHorizontal size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="border-b border-border mb-8">
                        <nav className="flex flex-nowrap gap-8 overflow-x-auto no-scrollbar w-full">
                            {tabs.map(tab => {
                                const isActive = tab.exact ? pathname === tab.path : pathname.startsWith(tab.path);
                                return (
                                    <Link
                                        key={tab.name}
                                        to={tab.path}
                                        className={`pb-4 text-[15px] font-medium whitespace-nowrap transition-colors border-b-[2px] ${
                                            isActive
                                                ? 'border-text-h text-text-h'
                                                : 'border-transparent text-text hover:text-text-h'
                                        }`}
                                    >
                                        {tab.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-6">
                        <Routes>
                            <Route path="/" element={<ProfileHome user={profileUser} />} />
                            <Route path="/reposts" element={<ProfileReposts />} />
                            <Route path="/activity" element={<ProfileActivity />} />
                            <Route path="/about" element={<ProfileAbout user={profileUser} isOwnProfile={isOwnProfile} />} />
                        </Routes>
                    </div>
                </div>
            </div>

            <ProfileRightSidebar user={profileUser} isOwnProfile={isOwnProfile} />
        </div>
    );
}
