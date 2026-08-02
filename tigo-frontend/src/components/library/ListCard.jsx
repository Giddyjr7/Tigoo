import { Lock, MoreHorizontal } from 'lucide-react';
import { MOCK_USERS } from '../../mocks/mockData';

export default function ListCard({ 
    title = "Reading list", 
    storyCount = 3, 
    user = MOCK_USERS[0], 
    imageUrl = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' 
}) {
    return (
        <div className="bg-[#f9f9f9] rounded-md p-5 flex flex-col justify-between h-[220px] relative overflow-hidden group cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
            {/* Fake Background Images for stories */}
            {imageUrl && (
                <div className="absolute right-0 top-0 bottom-0 w-1/3 flex">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
                </div>
            )}
            
            <div className="flex flex-col h-full z-10 max-w-[66%] justify-between">
                <div className="flex items-center gap-2">
                    <img src={user.avatarUrl} alt="User avatar" className="w-5 h-5 rounded-full bg-white object-cover" />
                    <span className="text-sm font-medium text-text-h">{user.displayName}</span>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-text-h mb-2 line-clamp-2">{title}</h3>
                    <div className="flex items-center gap-2 text-[13px] text-text">
                        <span>{storyCount} stories</span>
                        <Lock size={12} />
                    </div>
                </div>
            </div>
            
            <button className="absolute bottom-4 right-4 z-20 text-text hover:text-text-h p-1 rounded-full hover:bg-gray-200 transition-colors">
                <MoreHorizontal size={20} />
            </button>
        </div>
    );
}
