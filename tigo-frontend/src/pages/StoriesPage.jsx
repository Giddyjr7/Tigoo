import { Link, Route, Routes, useLocation } from 'react-router-dom';
import StoriesDrafts from '../components/stories/StoriesDrafts';
import StoriesScheduled from '../components/stories/StoriesScheduled';
import StoriesPublished from '../components/stories/StoriesPublished';
import StoriesUnlisted from '../components/stories/StoriesUnlisted';
import StoriesSubmissions from '../components/stories/StoriesSubmissions';

export default function StoriesPage() {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/$/, '');
    const basePath = '/stories';

    const tabs = [
        { name: 'Drafts 1', path: basePath, exact: true },
        { name: 'Scheduled', path: `${basePath}/scheduled` },
        { name: 'Published', path: `${basePath}/published` },
        { name: 'Unlisted', path: `${basePath}/unlisted` },
        { name: 'Submissions', path: `${basePath}/submissions` },
    ];

    return (
        <div className="flex w-full justify-center">
            <div className="w-full max-w-[1032px] px-6 md:px-12 lg:px-16 py-12">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="!m-0 text-3xl md:text-[42px] font-bold text-text-h tracking-tight">Stories</h1>
                    <button className="px-5 py-2 rounded-full border border-text-h text-text-h text-[14px] font-medium hover:bg-black/5 transition-colors">
                        Import a story
                    </button>
                </div>

                <div className="border-b border-border mb-8">
                    <nav className="flex flex-nowrap gap-8 overflow-x-auto no-scrollbar w-full">
                        {tabs.map(tab => {
                            const isActive = tab.exact ? pathname === tab.path : pathname.startsWith(tab.path);
                            return (
                                <Link
                                    key={tab.name}
                                    to={tab.path}
                                    className={`pb-4 text-[14px] whitespace-nowrap transition-colors border-b-[1px] ${
                                        isActive
                                            ? 'border-text-h text-text-h font-medium'
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
                        <Route path="/" element={<StoriesDrafts />} />
                        <Route path="/scheduled" element={<StoriesScheduled />} />
                        <Route path="/published" element={<StoriesPublished />} />
                        <Route path="/unlisted" element={<StoriesUnlisted />} />
                        <Route path="/submissions" element={<StoriesSubmissions />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
