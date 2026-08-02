import { Link, Route, Routes, useLocation } from 'react-router-dom';
import YourLists from '../components/library/YourLists';
import SavedLists from '../components/library/SavedLists';
import Highlights from '../components/library/Highlights';
import ReadingHistory from '../components/library/ReadingHistory';
import Responses from '../components/library/Responses';

export default function LibraryPage() {
    const location = useLocation();
    const currentPath = location.pathname;

    const tabs = [
        { name: 'Your lists', path: '/library' },
        { name: 'Saved lists', path: '/library/saved' },
        { name: 'Highlights', path: '/library/highlights' },
        { name: 'Reading history', path: '/library/history' },
        { name: 'Responses', path: '/library/responses' },
    ];

    return (
        <div className="flex-1 max-w-[1032px] mx-auto w-full px-6 py-10 lg:px-8">
            <div className="flex items-center justify-between mb-10">
                <h1 className="!m-0 !text-[42px] font-bold tracking-tight">Your library</h1>
                {currentPath === '/library' && (
                    <button className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                        New list
                    </button>
                )}
            </div>

            <div className="border-b border-border mb-8">
                <nav className="flex gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => {
                        const isActive = currentPath === tab.path;
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
                    <Route path="/" element={<YourLists />} />
                    <Route path="/saved" element={<SavedLists />} />
                    <Route path="/highlights" element={<Highlights />} />
                    <Route path="/history" element={<ReadingHistory />} />
                    <Route path="/responses" element={<Responses />} />
                </Routes>
            </div>
        </div>
    );
}
