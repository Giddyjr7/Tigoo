import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StoriesDrafts() {
    return (
        <div className="flex flex-col">
            {/* Headers */}
            <div className="flex text-[13px] text-text font-medium mb-6 pb-2 border-b border-transparent">
                <div className="flex-1">Latest</div>
                <div className="w-[120px] md:w-[150px] text-left">Publication</div>
                <div className="w-[80px] md:w-[100px] text-left">Status</div>
                <div className="w-[40px]"></div> {/* Spacer for the ... button */}
            </div>

            {/* Draft Item */}
            <div className="flex items-center group py-4 border-b border-border">
                {/* Image and Title column */}
                <div className="flex flex-1 items-center gap-4 min-w-0 pr-4">
                    <div className="w-[72px] h-[52px] bg-[#f2f2f2] flex-shrink-0 rounded-sm overflow-hidden border border-border/50 relative flex items-center justify-center">
                        {/* Simple CSS drawing to mimic the cursive 'to' in the mockup image */}
                        <div className="text-[12px] italic text-gray-400 rotate-[-15deg] opacity-60 font-serif">to</div>
                    </div>
                    <div className="flex flex-col min-w-0 justify-center">
                        <Link to="#" className="text-[16px] font-bold text-text-h mb-1 truncate hover:underline">to</Link>
                        <span className="text-[13px] text-text truncate">
                            1 min read (1 words) · Updated 1d ago
                        </span>
                    </div>
                </div>

                {/* Publication column */}
                <div className="w-[120px] md:w-[150px]">
                    {/* Empty in mockup */}
                </div>

                {/* Status column */}
                <div className="w-[80px] md:w-[100px]">
                    {/* Empty in mockup */}
                </div>

                {/* More options button */}
                <div className="w-[40px] flex justify-end">
                    <button className="text-text hover:text-text-h p-1 rounded-full hover:bg-black/5 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
