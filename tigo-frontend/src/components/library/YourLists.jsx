import { Bookmark, X, Lock, MoreHorizontal } from 'lucide-react';
import { MOCK_USERS } from '../../mocks/mockData';

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
                {/* Reading List Card */}
                <div className="bg-[#f9f9f9] rounded-md p-5 flex flex-col justify-between h-[220px] relative overflow-hidden group cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                    {/* Fake Background Images for stories */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 flex">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80)' }} />
                    </div>
                    
                    <div className="flex flex-col h-full z-10 max-w-[66%] justify-between">
                        <div className="flex items-center gap-2">
                            <img src={MOCK_USERS[0].avatarUrl} alt="User avatar" className="w-5 h-5 rounded-full bg-white" />
                            <span className="text-sm font-medium text-text-h">{MOCK_USERS[0].displayName}</span>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-text-h mb-2 line-clamp-2">Reading list</h3>
                            <div className="flex items-center gap-2 text-[13px] text-text">
                                <span>3 stories</span>
                                <Lock size={12} />
                            </div>
                        </div>
                    </div>
                    
                    <button className="absolute bottom-4 right-4 z-20 text-text hover:text-text-h p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
