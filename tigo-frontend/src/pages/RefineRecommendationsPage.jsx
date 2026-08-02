import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FollowingTab from '../components/me/FollowingTab';
import ReadingHistoryTab from '../components/me/ReadingHistoryTab';
import MutedTab from '../components/me/MutedTab';
import SuggestionsTab from '../components/me/SuggestionsTab';
import RightSidebar from '../components/layout/RightSidebar';
import ScrollableRow from '../components/layout/ScrollableRow';

export default function RefineRecommendationsPage() {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/$/, '');
    const basePath = '/me/following';

    const tabs = [
        { name: 'Following', path: basePath, exact: true },
        { name: 'Reading history', path: `${basePath}/history` },
        { name: 'Muted', path: `${basePath}/muted` },
        { name: 'Suggestions', path: `${basePath}/suggestions` }
    ];

    return (
        <div className="flex w-full">
            <div className="flex-1 min-w-0 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12">
                <div className="w-full max-w-[700px] mx-auto xl:mx-0">
                    
                    <div className="mb-8 md:mb-12">
                        <h1 className="!m-0 text-3xl md:text-[42px] font-bold font-serif text-[#242424] tracking-tight mb-3 md:mb-4">
                            Refine recommendations
                        </h1>
                        <p className="text-text text-[15px] md:text-[16px]">
                            Adjust recommendations by updating what you're following, your reading history, and who you've muted.
                        </p>
                    </div>

                    <div className="border-b border-border mb-8 md:mb-12">
                        <ScrollableRow className="items-center gap-8 -mb-[1px]">
                            {tabs.map(tab => {
                                const isActive = tab.exact ? pathname === tab.path : pathname.startsWith(tab.path);
                                return (
                                    <Link
                                        key={tab.name}
                                        to={tab.path}
                                        className={`pb-4 text-[14px] whitespace-nowrap transition-colors border-b-[1px] ${
                                            isActive
                                                ? 'border-[#242424] text-[#242424] font-medium'
                                                : 'border-transparent text-text hover:text-[#242424]'
                                        }`}
                                    >
                                        {tab.name}
                                    </Link>
                                );
                            })}
                        </ScrollableRow>
                    </div>

                    <div className="mt-6">
                        <Routes>
                            <Route path="/" element={<FollowingTab />} />
                            <Route path="/history" element={<ReadingHistoryTab />} />
                            <Route path="/muted" element={<MutedTab />} />
                            <Route path="/suggestions" element={<SuggestionsTab />} />
                        </Routes>
                    </div>
                </div>
            </div>
            
            <RightSidebar />
        </div>
    );
}
