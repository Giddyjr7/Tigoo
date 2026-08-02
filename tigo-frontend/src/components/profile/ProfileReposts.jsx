import { Repeat2, Upload, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileReposts() {
    return (
        <div className="flex flex-col mt-4 max-w-[680px]">
            <div className="flex items-center gap-2 text-[13px] text-text mb-3">
                <span>You</span>
                <Repeat2 size={14} className="text-text" />
                <span>reposted</span>
                <span>&bull;</span>
                <span>Jul 12</span>
            </div>

            <div className="border border-border rounded-md overflow-hidden flex flex-col md:flex-row group mb-4">
                <div className="w-full md:w-[200px] h-[150px] bg-social-bg flex-shrink-0">
                    <img 
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" 
                        alt="Scaling Any System" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-5 flex flex-col justify-center bg-white flex-1 min-w-0">
                    <Link to="#" className="block group-hover:underline">
                        <h3 className="text-[17px] font-bold text-text-h mb-1.5 leading-tight line-clamp-2">
                            Scaling Any System to Millions or Billions of Use...
                        </h3>
                    </Link>
                    <p className="text-[14px] text-text mb-3 line-clamp-2 leading-snug">
                        When we first launched our app, scaling was the last thing on our minds.
                    </p>
                    <div className="flex items-center gap-1.5 text-[13px] text-text">
                        <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Himanshu" 
                            alt="Himanshu Singour" 
                            className="w-4 h-4 rounded-full bg-border object-cover"
                        />
                        <span className="font-medium">Himanshu Singour</span>
                        <span>&bull;</span>
                        <span>Jun 5, 2025</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-text mb-12">
                <button className="hover:text-text-h transition-colors">
                    <Upload size={18} strokeWidth={1.5} />
                </button>
                <button className="hover:text-text-h transition-colors">
                    <MoreHorizontal size={20} strokeWidth={1.5} />
                </button>
            </div>

            <div className="text-center py-10">
                <span className="text-[14px] text-text">You're all caught up!</span>
            </div>
        </div>
    );
}
