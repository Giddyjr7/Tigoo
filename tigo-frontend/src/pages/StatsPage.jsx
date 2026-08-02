import { Link } from 'react-router-dom';
import { ChevronDown, Info } from 'lucide-react';

export default function StatsPage() {
    // Ensuring headings bypass any global serif rules
    const sansFont = { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };

    return (
        <div className="flex-1 w-full flex">
            <div className="w-full max-w-[1040px] py-10 px-6 md:px-12">
                <div className="mb-12">
                    <h1 className="!m-0 text-[42px] font-bold text-[#242424] tracking-tight" style={sansFont}>Stats</h1>
                </div>

                <div className="w-full border-b border-[#F2F2F2] mb-12">
                    <nav className="flex flex-nowrap gap-8 overflow-x-auto no-scrollbar -mb-[1px] w-full">
                        <Link to="#" className="pb-4 text-[14px] whitespace-nowrap transition-colors border-b-[2px] border-black text-[#242424] font-bold">
                            Stories
                        </Link>
                        <Link to="#" className="pb-4 text-[14px] whitespace-nowrap transition-colors border-b-[2px] border-transparent text-[#242424] opacity-70 hover:opacity-100 font-medium">
                            Audience
                        </Link>
                    </nav>
                </div>

                {/* Monthly Section */}
                <div className="flex items-start justify-between mb-8 w-full">
                    <div>
                        <h2 className="text-[22px] font-bold text-[#242424] mb-1" style={sansFont}>Monthly</h2>
                        <div className="text-[14px] text-text">
                            August 1, 2026 - Today (UTC) · Updated hourly
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-[13px] text-text-h hover:border-gray-400 transition-colors">
                        August 2026
                        <ChevronDown size={14} className="text-text" />
                    </button>
                </div>

                {/* Metrics Summary Row */}
                <div className="flex flex-wrap gap-8 md:gap-12 mb-12">
                    <div className="flex flex-col">
                        <span className="text-[36px] font-bold text-[#242424] leading-none mb-2" style={sansFont}>0</span>
                        <div className="flex items-center gap-1.5 text-[14px] font-[500] text-[#242424]">
                            Presentations
                            <Info size={14} className="text-[#242424]" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[36px] font-bold text-[#242424] leading-none mb-2" style={sansFont}>0</span>
                        <span className="text-[14px] font-[500] text-[#242424]">Views</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[36px] font-bold text-[#242424] leading-none mb-2" style={sansFont}>0</span>
                        <span className="text-[14px] font-[500] text-[#242424]">Reads</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[36px] font-bold text-[#242424] leading-none mb-2" style={sansFont}>0</span>
                        <span className="text-[14px] font-[500] text-[#242424]">Followers</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[36px] font-bold text-[#242424] leading-none mb-2" style={sansFont}>0</span>
                        <span className="text-[14px] font-[500] text-[#242424]">Subscribers</span>
                    </div>
                </div>

                {/* Mock Chart Area */}
                <div className="w-full mb-20">
                    <div className="relative w-full h-[250px] border-l border-b border-[#E6E6E6] flex">
                        {/* Vertical Grid Lines */}
                        <div className="flex-1 border-r border-[#E6E6E6]/60"></div>
                        <div className="flex-1 border-r border-[#E6E6E6]/60"></div>
                        <div className="flex-1 border-r border-[#E6E6E6]/60"></div>
                        <div className="flex-1 border-r border-[#E6E6E6]/60"></div>
                        <div className="flex-1 border-r border-[#E6E6E6]/60"></div>
                        <div className="flex-1 border-r border-[#E6E6E6]/60"></div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute -left-4 top-0 text-[11px] text-text">1</div>
                        <div className="absolute -left-4 bottom-0 text-[11px] text-text transform translate-y-1/2">0</div>
                        
                        {/* The Green Data Line (flat at 0) */}
                        <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-green-700 z-10"></div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-[11px] text-text">
                        <span>Aug 1</span>
                        <span className="translate-x-[50%]">Aug 4</span>
                        <span>Aug 7</span>
                    </div>

                    {/* Chart Legend */}
                    <div className="flex justify-end gap-4 mt-4 text-[12px] text-[#242424]">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full border border-gray-300"></div>
                            Views
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-700"></div>
                            Reads
                        </div>
                    </div>
                </div>

                {/* Lifetime Table Section */}
                <div className="mb-8 w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[22px] font-bold text-[#242424]" style={sansFont}>Lifetime</h2>
                        <button className="flex items-center gap-2 text-[13px] text-text hover:text-[#242424] transition-colors">
                            Latest
                            <ChevronDown size={14} />
                        </button>
                    </div>

                    <div className="flex text-[13px] text-text font-medium mb-4 pb-2 border-b border-border">
                        <div className="flex-1">Story</div>
                        <div className="flex gap-8 justify-end">
                            <div className="w-[100px] flex items-center justify-end gap-1">
                                Presentations <Info size={14} className="text-text" />
                            </div>
                            <div className="w-[60px] text-right">Views</div>
                            <div className="w-[60px] text-right">Reads</div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <span className="text-[15px] font-[500] text-[#242424]">You haven't published any stories yet.</span>
                        <button className="bg-[#242424] text-white px-5 py-2 rounded-full text-[15px] font-[500] hover:bg-black transition-colors">
                            Start writing
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
