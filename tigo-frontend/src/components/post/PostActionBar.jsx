import { MessageCircle, ThumbsUp, Bookmark, PlayCircle, Share, MoreHorizontal, Repeat } from 'lucide-react';
import { useClaps } from '../../hooks/useClaps';

export default function PostActionBar({ post, commentCount = 0 }) {
    const { totalClaps, handleClap } = useClaps(post?.id, post?.clapCount || 0);

    return (
        <div className="flex items-center justify-between text-text py-3 my-8 border-y border-border max-w-[800px] mx-auto w-full">
            <div className="flex items-center gap-6">
                <button onClick={handleClap} className="flex items-center gap-2 hover:text-text-h transition-colors" title="Claps">
                    <ThumbsUp size={22} strokeWidth={1.2} />
                    <span className="text-sm">{totalClaps}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-text-h transition-colors" title="Comments">
                    <MessageCircle size={22} strokeWidth={1.2} />
                    <span className="text-sm">{commentCount}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-text-h transition-colors" title="Repost">
                    <Repeat size={22} strokeWidth={1.2} />
                </button>
            </div>
            <div className="flex items-center gap-5">
                <button className="hover:text-text-h transition-colors" title="Bookmark">
                    <Bookmark size={22} strokeWidth={1.2} />
                </button>
                <button className="hover:text-text-h transition-colors" title="Listen">
                    <PlayCircle size={22} strokeWidth={1.2} />
                </button>
                <button className="hover:text-text-h transition-colors" title="Share">
                    <Share size={22} strokeWidth={1.2} />
                </button>
                <button className="hover:text-text-h transition-colors" title="More options">
                    <MoreHorizontal size={22} strokeWidth={1.2} />
                </button>
            </div>
        </div>
    );
}
