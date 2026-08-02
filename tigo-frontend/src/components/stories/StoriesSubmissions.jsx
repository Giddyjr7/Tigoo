import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function StoriesSubmissions() {
    return (
        <div className="flex flex-col">
            {/* Headers */}
            <div className="flex text-[13px] text-text font-medium mb-6 pb-2 border-b border-transparent">
                <div className="flex-1">Latest</div>
                <div className="w-[120px] md:w-[150px] text-left">Publication</div>
                <div className="w-[80px] md:w-[100px] text-left flex items-center gap-1 cursor-pointer">
                    Status <ChevronDown size={14} />
                </div>
                <div className="w-[40px]"></div> {/* Spacer */}
            </div>

            <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-[15px] font-medium text-text-h mb-2">No submissions yet.</span>
                <Link to="#" className="text-[15px] text-text underline hover:text-text-h transition-colors">
                    Explore publications
                </Link>
            </div>
        </div>
    );
}
