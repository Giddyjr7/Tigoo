import { Bookmark, X, Lock, MoreHorizontal } from 'lucide-react';
import { MOCK_USERS } from '../../mocks/mockData';
import ListCard from './ListCard';

export default function YourLists() {
    return (
        <div className="flex flex-col gap-10">
            {/* Promotion Banner */}
            <div className="relative bg-[#1a8917] rounded-md p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-sm">
                <button className="absolute top-4 right-4 text-white hover:opacity-80 transition-opacity">
                    <X size={16} />
                </button>
                <div className="flex flex-col items-start gap-4 z-10 max-w-[400px]">
                    <h2 className="text-white text-[22px] font-bold leading-tight !m-0">
                        Create a list to easily organize and share stories
                    </h2>
                    <button className="bg-black text-white px-5 py-2 rounded-full text-[15px] font-medium hover:bg-gray-900 transition-colors">
                        Start a list
                    </button>
                </div>
                <div className="mt-6 md:mt-0 z-10 md:mr-16">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Bookmark className="text-[#1a8917]" size={32} strokeWidth={2} />
                    </div>
                </div>
                {/* Decorative circle */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[300px] h-[300px] bg-white opacity-10 rounded-full mix-blend-overlay pointer-events-none" />
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ListCard />
            </div>
        </div>
    );
}
