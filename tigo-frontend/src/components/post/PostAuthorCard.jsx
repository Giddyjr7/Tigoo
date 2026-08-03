import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostAuthorCard({ author }) {
    if (!author) return null;

    return (
        <div className="max-w-[800px] mx-auto w-full pt-12 pb-8 border-b border-border">
            <Link to={`/profile/${author.id}`}>
                <img 
                    src={author.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
                    alt={author.displayName}
                    className="w-16 h-16 rounded-full object-cover mb-6"
                />
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-h">
                        <Link to={`/profile/${author.id}`}>
                            Written by {author.displayName}
                        </Link>
                    </h2>
                    <div className="text-text text-sm mt-1">
                        {author.followers?.toLocaleString() || 0} Followers &bull; {author.following?.toLocaleString() || 0} Following
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => toast('Following writers is coming soon!', { icon: '🚧' })}
                        className="px-5 py-2 bg-text-h text-bg rounded-full font-medium hover:bg-opacity-90 transition-all text-sm"
                    >
                        Follow
                    </button>
                    <button 
                        onClick={() => toast('Support/Tip is coming soon!', { icon: '🚧' })}
                        className="w-10 h-10 flex items-center justify-center bg-bg border border-border text-text-h rounded-full hover:bg-social-bg transition-all" title="Support this author"
                    >
                        <Heart size={18} />
                    </button>
                </div>
            </div>
            <p className="text-text leading-relaxed">
                {author.bio || 'This author has not provided a bio.'}
            </p>
        </div>
    );
}
